import datetime as dt

import fire
import pandas as pd

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

tokenizer = AutoTokenizer.from_pretrained("deep-learning-analytics/automatic-title-generation")
model = AutoModelForSeq2SeqLM.from_pretrained("deep-learning-analytics/automatic-title-generation")


def post_header(title):
    return (f"---\nlayout: post\ntitle:  'Re: \"{title.split(':')[0]}\"'\n"
            f"date:   {dt.datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
            "categories: reading\nhidden: true\n---\n\n")

def post_table(title, author, url, url_type):
    return (
        f"| **Title** | {title} |\n"
        f"| **Author** | {author} |\n"
        f"| **URL** | [{url_type}]({url}) |\n"
    )

def highlight_to_blockquote(title, highlight):
    content = ''.join([f"<p>{x}</p>" for x in highlight.split('\n') if x != ''])
    return f"### {title}\n<blockquote>{content}</blockquote>"

def generate_title(paragraph):
    inputs = tokenizer(paragraph, return_tensors="pt").input_ids
    outputs = model.generate(inputs)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def main(title, highlights_csv, author, url, url_type):
    post = post_header(title)

    post += post_table(title, author, url, url_type)

    highlights = pd.read_csv(highlights_csv)

    for i in highlights.index:
        highlights.loc[i, 'suggested_title'] = generate_title(highlights.loc[i, 'Highlight'])
        post += '\n\n' + highlight_to_blockquote(highlights.loc[i, 'suggested_title'],
                                                 highlights.loc[i, 'Highlight'])

    with open(f"_posts/{dt.datetime.now().strftime('%Y-%m-%d')}-{title.split(':')[0].lower().replace(' ','_')}.md", 'w') as f:
        f.write(post)



if __name__ == '__main__':
    fire.Fire(main)
