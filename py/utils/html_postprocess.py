# utils/html_postprocess.py

from bs4 import BeautifulSoup

def fix_html_metadata(html_path, title_text="Altair Chart"):
    """Fixes metadata and accessibility warnings in exported Altair HTML files."""
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")

    # Add lang="en" to <html>
    if soup.html:
        soup.html["lang"] = "en"

    # Fix <head> content
    if soup.head:
        # Remove old <meta http-equiv>
        for meta in soup.head.find_all("meta"):
            if meta.get("http-equiv") == "content-type":
                meta.decompose()

        # Add charset, title, and viewport
        soup.head.insert(0, soup.new_tag("meta", charset="utf-8"))

        title_tag = soup.new_tag("title")
        title_tag.string = title_text
        soup.head.insert(1, title_tag)

        viewport = soup.new_tag("meta")
        viewport.attrs["name"] = "viewport"
        viewport.attrs["content"] = "width=device-width, initial-scale=1.0"
        soup.head.insert(2, viewport)

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(str(soup))
