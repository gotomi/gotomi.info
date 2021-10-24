import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';


import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const md = MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                    '</code></pre>';
            } catch (__) { }
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});


function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

// retrieve date from filename
function getData() {
    const dir = '../_data/posts';
    const files = fs.readdirSync(new URL(dir, import.meta.url), 'utf-8');

    let posts = [];

    files.forEach(file => {
        const fileContent = fs.readFileSync(new URL(path.join(dir, file), import.meta.url), 'utf-8');
        const { data, content, excerpt } = matter(fileContent, { excerpt_separator: '<!--more-->' });
        let date, year, month, day, slug;

        const dateString = file.slice(0, 10);
        if (isValidDate(new Date(dateString))) {
            date = new Date(dateString);
            [year, month, day] = dateString.split('-');
            slug = year + '-' + month + '-' + file.slice(11, -3);

        } else {
            throw ('Invalid date. File must start with something like this: 2021-02-22');
        }


        posts.push({ data, content: md.render(content), excerpt: md.render(excerpt), date, year, month, day, slug })
    })

    return posts.sort((a, b) => b.date - a.date)
}

const AllPosts = getAllPosts();

export function getPostBySlug(slug) {
    return AllPosts.filter(item => item.slug === slug)[0]
}

export function getPostsByAuthor(author) {
    return AllPosts.filter(item => item.data.author.includes(author));
}

export function getPostsByTag(tag) {
    return AllPosts.filter(item => item.data.tags.includes(tag));
}

export function getAllSlugs() {
    return AllPosts.map(item => item.slug)
}


export function getAllTags() {
    return AllPosts.map(item => item.data.tags).reduce((a, b) => a.concat(b))
}

export function getAllAuthors() {
    return AllPosts.map(item => item.data.author).reduce((a, b) => a.concat(b))
}


export function getAllPosts() {
    return getData();
}

function writeAllPostsToJson() {
    const dir = '../_data/posts';
    const file = 'posts.json';
    const AllPosts = getAllPosts();
    fs.writeFileSync(new URL(path.join(dir, file), import.meta.url), JSON.stringify(AllPosts), 'utf-8')
}


writeAllPostsToJson();