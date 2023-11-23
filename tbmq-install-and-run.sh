#!/bin/bash
#
# Copyright © 2016-2023 The Thingsboard Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

set -u

# Function to check if a directory exists
check_directory_exists() {
  if [ -d "$1" ]; then
    return 0
  else
    return 1
  fi
}

# Function to check if all subdirectories are present
check_subdirectories_exist() {
  local subdirs=("kafka" "log" "data" "postgres")
  for subdir in "${subdirs[@]}"; do
    if ! check_directory_exists "$1/$subdir"; then
      echo "$subdir directory is missing!"
      return 1
    fi
  done
  return 0
}

# Function to check directory permissions
check_directory_permissions() {
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    local uid_log=$(stat -c "%u" "$1/log")
    local gid_log=$(stat -c "%g" "$1/log")
    local uid_data=$(stat -c "%u" "$1/data")
    local gid_data=$(stat -c "%g" "$1/data")
    if [[ "$uid_log" == "799" && "$gid_log" == "799" && "$uid_data" == "799" && "$gid_data" == "799" ]]; then
      return 0
    else
      return 1
    fi
  else
    return 0
  fi
}

# Check if docker-compose.yml is present
if [ -f "docker-compose.yml" ]; then
  echo "docker-compose.yml is already present in the current directory. Skipping download."
else
  echo "docker-compose.yml is absent in the current directory. Downloading the file..."
  wget https://raw.githubusercontent.com/thingsboard/tbmq/release-1.2.0/msa/tbmq/configs/docker-compose.yml
fi

# Check if ~/.tb-mqtt-broker-data directory exists
if check_directory_exists "$HOME/.tb-mqtt-broker-data"; then
  # Check if all subdirectories are present
  if check_subdirectories_exist "$HOME/.tb-mqtt-broker-data"; then
    # Check directory permissions
    if check_directory_permissions "$HOME/.tb-mqtt-broker-data"; then
      echo "Directories are present and permissions are correct."
    else
      read -r -p "Directory permissions are incorrect. Do you want to correct them? (y/n): " response
      if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "Correcting permissions..."
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
          sudo chown -R 799:799 "$HOME/.tb-mqtt-broker-data/log"
          sudo chown -R 799:799 "$HOME/.tb-mqtt-broker-data/data"
        fi
        echo "Permissions corrected."
      else
        echo "Skipping permission correction."
      fi
    fi
  else
    echo "Some subdirectories are missing within ~/.tb-mqtt-broker-data. Please create them manually with correct permissions and rerun the script."
    exit 1
  fi
else
  echo "Creating necessary directories..."
  mkdir -p "$HOME/.tb-mqtt-broker-data/kafka" "$HOME/.tb-mqtt-broker-data/log" "$HOME/.tb-mqtt-broker-data/data" "$HOME/.tb-mqtt-broker-data/postgres"
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sudo chown -R 799:799 "$HOME/.tb-mqtt-broker-data/log"
    sudo chown -R 799:799 "$HOME/.tb-mqtt-broker-data/data"
  fi
  echo "Directories created."
fi

echo "Starting TBMQ!"
# Check if "docker-compose" or "docker compose" command should be used
if command -v docker-compose >/dev/null 2>&1; then
  docker-compose up --build
else
  docker compose up --build
fi
