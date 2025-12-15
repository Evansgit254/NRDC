#!/bin/bash

# NRDC Database Backup Script
# Automatically backs up the SQLite database with timestamp

# Configuration
DB_FILE="./prisma/dev.db"
BACKUP_DIR="./backups"
RETENTION_DAYS=7

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Backup filename
BACKUP_FILE="$BACKUP_DIR/nrdc_backup_$TIMESTAMP.db"

# Check if database exists
if [ ! -f "$DB_FILE" ]; then
    echo "Error: Database file not found at $DB_FILE"
    exit 1
fi

# Create backup
echo "Creating backup: $BACKUP_FILE"
cp "$DB_FILE" "$BACKUP_FILE"

# Verify backup was created
if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup created successfully ($BACKUP_SIZE)"
else
    echo "❌ Backup failed"
    exit 1
fi

# Delete old backups (older than retention days)
echo "Cleaning up old backups (keeping last $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "nrdc_backup_*.db" -type f -mtime +$RETENTION_DAYS -delete

# Count remaining backups
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/nrdc_backup_*.db 2>/dev/null | wc -l)
echo "Total backups: $BACKUP_COUNT"

echo "✅ Backup completed!"
