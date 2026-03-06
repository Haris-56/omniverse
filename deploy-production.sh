#!/bin/bash
# High-Efficiency Deployment Script (World-Class Engine)

# 1. Stop all previous instances
echo "Shutting down old processes..."
pm2 delete all 2>/dev/null
docker-compose down -v --rmi all 2>/dev/null

# 2. Build and Startup (using Docker for perfect environment isolation)
echo "Building the Perfect Email Infrastructure..."
docker-compose up -d --build

# 3. Security & Logging
echo "Done! The software is now live in isolated containers."
echo "--------------------------------------------------------"
echo "To monitor the Email Engine in real-time, run:"
echo "docker logs -f omniverse-worker"
echo "--------------------------------------------------------"
echo "To check the Scheduler's pulse, run:"
echo "docker logs -f omniverse-scheduler"
echo "--------------------------------------------------------"
