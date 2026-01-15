#!/bin/bash
# ===========================================
# 08_backup.sh - Practical Example: Backup Script
# ===========================================

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Functions
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

show_usage() {
    echo "Usage: $0 <source_directory>"
    echo "Example: $0 ./my_project"
    exit 1
}

# Check arguments
if [ $# -eq 0 ]; then
    show_usage
fi

SOURCE_DIR=$1

# Validate source directory
if [ ! -d "$SOURCE_DIR" ]; then
    log_message "ERROR: Directory '$SOURCE_DIR' does not exist!"
    exit 1
fi

# Create backup directory if needed
if [ ! -d "$BACKUP_DIR" ]; then
    log_message "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
fi

# Get the directory name for the backup filename
DIR_NAME=$(basename "$SOURCE_DIR")
BACKUP_FILE="${BACKUP_DIR}/${DIR_NAME}_${DATE}.tar.gz"

# Create the backup
log_message "Starting backup of '$SOURCE_DIR'..."
tar -czf "$BACKUP_FILE" "$SOURCE_DIR" 2>/dev/null

# Check if backup succeeded
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log_message "SUCCESS: Backup created at $BACKUP_FILE ($BACKUP_SIZE)"
else
    log_message "ERROR: Backup failed!"
    exit 1
fi

# Show all backups
echo ""
log_message "All backups in $BACKUP_DIR:"
ls -lh "$BACKUP_DIR"

exit 0
