#!/bin/bash
# Installs Ghidra 12.1.4 (REA's verified version) and a JDK 21 so the REA MCP
# server can use Ghidra for native-binary analysis in cloud sessions.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

GHIDRA_VERSION="12.1.4"
GHIDRA_URL="https://github.com/NationalSecurityAgency/ghidra/releases/download/Ghidra_12.1.4_build/ghidra_12.1.4_PUBLIC_20260921.zip"
GHIDRA_SHA256="ddac49f903da9d5bac833e5cc79395098b9c33cfd3279be5f31bd00387d2d4db"
GHIDRA_PARENT="/opt/ghidra"
GHIDRA_INSTALL_DIR="${GHIDRA_PARENT}/ghidra_${GHIDRA_VERSION}_PUBLIC"
JAVA_HOME="/usr/lib/jvm/java-21-openjdk-amd64"

# JDK 21 (full JDK with javac is required by REA's Ghidra provider).
if [ ! -x "${JAVA_HOME}/bin/javac" ]; then
  echo "Installing OpenJDK 21..." >&2
  apt-get update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq openjdk-21-jdk-headless >&2
fi

# Ghidra, checksum-verified; skipped when already installed.
if [ ! -f "${GHIDRA_INSTALL_DIR}/Ghidra/application.properties" ]; then
  echo "Installing Ghidra ${GHIDRA_VERSION}..." >&2
  tmp="$(mktemp -d)"
  trap 'rm -rf "${tmp}"' EXIT
  curl -fsSL --retry 4 --retry-delay 2 -o "${tmp}/ghidra.zip" "${GHIDRA_URL}"
  echo "${GHIDRA_SHA256}  ${tmp}/ghidra.zip" | sha256sum -c - >&2
  mkdir -p "${GHIDRA_PARENT}"
  if command -v unzip >/dev/null 2>&1; then
    unzip -q "${tmp}/ghidra.zip" -d "${tmp}/x"
  else
    python3 -I -c 'import sys, zipfile; zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])' "${tmp}/ghidra.zip" "${tmp}/x"
  fi
  # Python's extractor drops permission bits; restore executables.
  find "${tmp}/x" -type f \( -name '*.sh' -o -name 'ghidraRun' -o -name 'decompile' -o -name 'sleigh' -o -name 'analyzeHeadless' -o -name 'launch.sh' \) -exec chmod +x {} +
  rm -rf "${GHIDRA_INSTALL_DIR}"
  mv "${tmp}/x/ghidra_${GHIDRA_VERSION}_PUBLIC" "${GHIDRA_INSTALL_DIR}"
fi

# Expose the paths to Bash commands in this session (the MCP server gets them
# from .mcp.json).
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  {
    echo "export GHIDRA_INSTALL_DIR=\"${GHIDRA_INSTALL_DIR}\""
    echo "export JAVA_HOME=\"${JAVA_HOME}\""
  } >> "${CLAUDE_ENV_FILE}"
fi
