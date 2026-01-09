
import re
import os

file_path = r'c:\Users\salva\.gemini\antigravity\scratch\paradise-nextgenbali\faq.html'

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    content = read_file(file_path)
    
    # Extract the blog-content block
    start_tag = '<div class="blog-content">'
    end_tag = '<footer class="blog-footer">'
    
    start_idx = content.find(start_tag)
    end_idx = content.find(end_tag)
    
    if start_idx == -1 or end_idx == -1:
        print("Could not find start or end tags")
        return

    # Capture the content to replace
    # We want to keep the start tag and insert after it, and stop before the end tag.
    # Actually, let's just replace the inner content of blog-content if possible, 
    # but the footer is outside.
    # Let's extract everything between start_tag and end_tag
    old_block = content[start_idx + len(start_tag):end_idx]

    # Regex to extract items
    # Structure: <!-- FAQ ITEM \d+ --> ... <div class="faq-card" ...> ... </div>
    # We look for the comment, matching the ID, then the div.
    item_pattern = re.compile(
        r'<!-- FAQ ITEM (\d+) -->\s*<div class="faq-card"[^>]*>.*?<details>.*?<summary[^>]*>(.*?)</summary>(.*?)</div>\s*</details>\s*</div>',
        re.DOTALL
    )
    
    items = {}
    for match in item_pattern.finditer(old_block):
        item_id = int(match.group(1))
        # title = match.group(2).strip() # We might replace this
        # inner_details = match.group(3) # Everything after summary: <div ...Answer">...</div>
        full_match = match.group(0) # The whole block including the comment? 
        # Actually my regex capturing group 0 encompasses the whole match including the comment if I start with it.
        # But wait, .*? is non-greedy.
        # Let's clean up the regex to capture the full HTML of the item.
        
        # Better: split by '<!-- FAQ ITEM'.
        pass

    # Different approach for extraction:
    # Split by '<!-- FAQ ITEM'
    parts = old_block.split('<!-- FAQ ITEM')
    # Part 0 is pre-text (usually empty or whitespace)
    # Part 1...N are the items
    
    parsed_items = {}
    for p in parts[1:]:
        # Extract ID
        # p starts with " 1 -->"
        try:
            id_end = p.find('-->')
            item_id_str = p[:id_end].strip()
            item_id = int(item_id_str)
            item_html = '<!-- FAQ ITEM' + p # Reconstruct
            
            # Extract content to modify title if needed
            # We need to parse valid HTML for title replacement.
            # <summary itemprop="name">Title</summary>
            summary_start = item_html.find('<summary itemprop="name">')
            summary_end = item_html.find('</summary>')
            
            if summary_start != -1 and summary_end != -1:
                current_title = item_html[summary_start + 25 : summary_end]
                parsed_items[item_id] = {
                    'html': item_html,
                    'title_range': (summary_start + 25, summary_end) # Relative to item_html
                    # We will reconstruct the string when needed
                }
            else:
                print(f"Warning: Could not find summary for item {item_id}")
                parsed_items[item_id] = {'html': item_html, 'title_range': None}
                
        except ValueError:
            print(f"Skipping part: {p[:20]}...")
            continue

    # Define Categories and Items
    # Structure: (CategoryTitle, [(ItemID, ValidNewTitleOrNone)])
    structure = [
        ("Off-plan vastgoed", [
            (7, "Wat zijn de voordelen van investeren in off-plan vastgoed?")
        ]),
        ("Aankoopproces Bali / Indonesië", [
            (8, "Hoe koop je een huis of ander vastgoed op Bali?"),
            (11, "Hoe koop je vastgoed in Indonesië?"),
            (12, "Kan je vastgoed op afstand kopen?")
        ]),
        ("Lokale professionals & begeleiding", [
            (9, "Hoe vind je een lokale makelaar, advocaat en notaris op Bali?")
        ]),
        ("Bedrijfsstructuren & ondernemen", [
            # Item 10 is " ... in Indonesië?". User asks for " ... op Bali?" AND " ... in Indonesië?".
            # I will just put Item 10 with its original title (or user's verify match).
            (10, "Welke bedrijfsstructuur heb je voor commercieel vastgoed in Indonesië?"),
            (18, "Wat is de minimale investering om een bedrijf in Indonesië te starten?")
        ]),
        ("Locatie & investeringskeuze", [
            (13, "Welke locaties bieden het hoogste rendement op investering (ROI) op Bali?"),
            (17, "Wat is belangrijk voor een goede investering in vastgoed op Bali?")
        ]),
        ("Eigendom & eigendomsvormen", [
            # User wants: "Kan je persoonlijk een villa kopen op Bali?" AND "Kan je als buitenlander vastgoed bezitten op Bali?"
            # Item 5 is "Zijn er beperkingen...". I'll use it for "Kan je als buitenlander..."
            (5, "Kan je als buitenlander vastgoed bezitten op Bali?"),
            # (Duplicate? "Kan je persoonlijk a villa..." - missing dedicated)
            # Item 1: Freehold via PT/PMA
            (1, "Wat is freehold eigendom via een PT of PMA?"),
            # Item 2: Leasehold
            (2, "Wat is leasehold eigendom?")
            # Missing: Difference between leasehold and freehold
        ]),
        ("Leasehold & looptijd", [
            (15, "Hoe lang kan je land leasen op Bali?"),
            (14, "Wat gebeurt er met het land na de leasehold-periode?")
        ]),
        ("Vergunningen & regelgeving", [
            # Missing standalone items. Leaving category empty? 
            # Better to not show category if empty.
        ]),
        ("Financiering", []),
        ("Rendement & berekeningen", []), # Missing ROI calc
        ("Beheer & exploitatie", [
            (16, "Hoe duur is villa-management op Bali?")
        ]),
        ("Kosten & belastingen", [
            (19, "Welke kosten en belastingen moet je in gedachten houden bij het investeren in vastgoed op Bali?"),
            (20, "Hoeveel belasting betaal je voor commercieel vastgoed op Bali?")
            # Missing: Commercieel Indonesië, Fiscale voordelen
        ]),
        ("Risico’s & due diligence", [
            (21, "Wat zijn de risico’s van vastgoed kopen op Bali?")
        ])
    ]

    new_html_content = "\n"

    for cat_title, items_list in structure:
        # Check if category has items
        valid_items = [i for i in items_list if i[0] in parsed_items]
        if not valid_items:
            continue
            
        new_html_content += f'                <h3 style="margin-top: 2.5rem; margin-bottom: 1.5rem; font-size: 1.4rem; color: #b89f80; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">{cat_title}</h3>\n'
        
        for item_id, new_title in valid_items:
            item_data = parsed_items[item_id]
            html_snippet = item_data['html']
            
            # Replace title if needed
            if new_title and item_data['title_range']:
                # Reconstruct
                # Find the summary tag in the snippet again to be safe
                s_start = html_snippet.find('<summary itemprop="name">')
                s_end = html_snippet.find('</summary>')
                if s_start != -1 and s_end != -1:
                    pre = html_snippet[:s_start + 25] # + len('<summary itemprop="name">')
                    post = html_snippet[s_end:]
                    html_snippet = pre + new_title + post
            
            new_html_content += html_snippet + "\n"

    # Now construct full file
    new_full_content = content[:start_idx + len(start_tag)] + new_html_content + "\n            " + content[end_idx:]
    
    write_file(file_path, new_full_content)
    print("Successfully reorganized FAQ.")

if __name__ == "__main__":
    main()
