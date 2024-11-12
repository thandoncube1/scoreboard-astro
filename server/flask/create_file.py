import sqlite3
from web_crawler import WebScraper

scrapper = WebScraper()

# Create a sqlite connection _ file to store data
connection = sqlite3.connect("articles.db")
cursor = connection.cursor()

# Create a table and execute query for the data store
cursor.execute("DROP TABLE IF EXISTS news_articles")
cursor.execute("""
               CREATE TABLE news_articles (
               id INTEGER PRIMARY KEY,
               title TEXT,
               description TEXT,
               FOREIGN KEY (image_id) REFERENCES images (image_id)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION
               )""")

# Make this a singleton class, for easy creation of Database storage