#!/usr/bin/env bash

set -euo pipefail

version="${1:-${GITHUB_REF_NAME:-}}"
if [[ ! "$version" =~ ^v[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]]; then
    echo "Invalid release version: ${version:-<empty>}" >&2
    exit 1
fi

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

release_dir="bin/release"
staging_dir="bin/release-staging"
rm -rf "$release_dir" "$staging_dir"
mkdir -p "$release_dir" "$staging_dir"

server_arches=(amd64 arm64)
agent_files=(
    alink-agent-linux-amd64
    alink-agent-linux-arm64
    alink-agent-linux-armv7
    alink-agent-linux-loong64
    alink-agent-darwin-amd64
    alink-agent-darwin-arm64
    alink-agent-windows-amd64.exe
    alink-agent-windows-arm64.exe
)

required_files=(
    README.md
    LICENSE
    config.sqlite.yaml
    config.postgresql.yaml
    web/dist/index.html
    web/public/logo.svg
)
for arch in "${server_arches[@]}"; do
    required_files+=("bin/alink-linux-${arch}")
done
for agent_file in "${agent_files[@]}"; do
    required_files+=("bin/agents/${agent_file}")
done

for required_file in "${required_files[@]}"; do
    if [[ ! -f "$required_file" ]]; then
        echo "Missing release input: $required_file" >&2
        exit 1
    fi
done

if ! grep -Fq "__ALINK_CUSTOM_JS__" web/dist/index.html \
    || ! grep -Fq "__ALINK_CUSTOM_CSS__" web/dist/index.html \
    || ! grep -Fq "[[.SystemNameZh]]" web/dist/index.html; then
    echo "Missing runtime template placeholders in web/dist/index.html" >&2
    exit 1
fi

for arch in "${server_arches[@]}"; do
    bundle_name="alink-${version}-linux-${arch}"
    bundle_dir="${staging_dir}/${bundle_name}"

    mkdir -p "$bundle_dir/bin" "$bundle_dir/web/public" "$bundle_dir/data" "$bundle_dir/logs"
    cp "bin/alink-linux-${arch}" "$bundle_dir/alink"
    cp -a bin/agents "$bundle_dir/bin/"
    cp -a web/dist "$bundle_dir/web/"
    cp "$bundle_dir/web/dist/index.html" "$bundle_dir/web/dist/index.html.tmpl"
    cp web/public/logo.svg "$bundle_dir/web/public/logo.svg"
    cp config.sqlite.yaml "$bundle_dir/config.yaml"
    cp config.sqlite.yaml "$bundle_dir/config.sqlite.example.yaml"
    cp config.postgresql.yaml "$bundle_dir/config.postgresql.example.yaml"
    cp README.md LICENSE "$bundle_dir/"

    chmod +x "$bundle_dir/alink"
    tar -C "$staging_dir" -czf "${release_dir}/${bundle_name}.tar.gz" "$bundle_name"
done

for agent_file in "${agent_files[@]}"; do
    source_path="bin/agents/${agent_file}"
    asset_name="${agent_file/alink-agent-/alink-agent-${version}-}"
    cp "$source_path" "${release_dir}/${asset_name}"
    if [[ "$asset_name" != *.exe ]]; then
        chmod +x "${release_dir}/${asset_name}"
    fi
done

(
    cd "$release_dir"
    sha256sum alink-* > SHA256SUMS
)

echo "Release assets:"
find "$release_dir" -maxdepth 1 -type f -printf '%f\n' | sort
