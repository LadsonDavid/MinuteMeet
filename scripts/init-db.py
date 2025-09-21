#!/usr/bin/env python3
"""
Database initialization script for MinuteMeet Pro
Creates PostgreSQL database and tables
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    """Create PostgreSQL database if it doesn't exist"""
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "password")
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'minutemeet'")
        exists = cursor.fetchone()
        
        if not exists:
            # Create database
            cursor.execute("CREATE DATABASE minutemeet")
            print("Database 'minutemeet' created successfully")
        else:
            print("Database 'minutemeet' already exists")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error creating database: {e}")
        sys.exit(1)

def create_tables():
    """Create tables using SQLAlchemy"""
    try:
        # Add backend to path
        sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
        
        from database import create_tables, test_connection
        
        # Test connection
        if test_connection():
            # Create tables
            create_tables()
            print("Database tables created successfully")
        else:
            print("Database connection failed")
            sys.exit(1)
            
    except Exception as e:
        print(f"Error creating tables: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("Initializing MinuteMeet Database...")
    print("Using PostgreSQL")
    
    # Create database
    create_database()
    
    # Create tables
    create_tables()
    
    print(" Database initialization complete!")
    print(" You can now start the application with: uvicorn main:app --reload")
