import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json

class WebScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def scrape_webpage(self, url):
        try:
            # Send GET request
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()

            # Parse HTML
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract title
            title = self._get_title(soup)

            # Extract meta description
            description = self._get_meta_description(soup)

            # Extract images
            images = self._get_images(soup, url)

            return {
                'title': title,
                'description': description,
                'images': images
            }

        except requests.RequestException as e:
            return {
                'error': f'Failed to fetch webpage: {str(e)}'
            }
        except Exception as e:
            return {
                'error': f'An error occurred: {str(e)}'
            }

    def _get_title(self, soup):
        # Try to get title from og:title first
        og_title = soup.find('meta', property='og:title')
        if og_title:
            return og_title.get('content')

        # Fallback to regular title tag
        title_tag = soup.find('title')
        return title_tag.string if title_tag else None

    def _get_meta_description(self, soup):
        # Try og:description first
        og_desc = soup.find('meta', property='og:description')
        if og_desc:
            return og_desc.get('content')

        # Fallback to regular meta description
        meta_desc = soup.find('meta', {'name': 'description'})
        return meta_desc.get('content') if meta_desc else None

    def _get_images(self, soup, base_url):
        images = []

        # Try og:image first
        og_image = soup.find('meta', property='og:image')
        if og_image:
            img_url = og_image.get('content')
            if img_url:
                images.append(urljoin(base_url, img_url))

        # Get other images
        for img in soup.find_all('img', src=True):
            img_url = img.get('src')
            if img_url:
                full_url = urljoin(base_url, img_url)
                if full_url not in images:
                    images.append(full_url)

        return images

def main():
    scraper = WebScraper()

    # Example usage
    url = input("Enter the webpage URL: ")
    result = scraper.scrape_webpage(url)

    # Pretty print the results
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()