/*
 * @FilePath: /nx-core/src/modules/backup/backup.interface.ts
 * @author: Wibus
 * @Date: 2022-08-11 18:20:13
 * @LastEditors: Wibus
 * @LastEditTime: 2022-08-12 12:12:02
 * Coding With IU
 */

/**

{
  "site": {
    "name": "Site Name",
    "keyword": [
      "keyword1",
      "keyword2"
    ],
    "description": "Site Description"
  },
  "master": {
    "name": "master name",
    "username": "master username",
    "mail": "master mail",
    "avatar": "master avatar",
    "url": "master url"
  },
  "categories": [
    {
      "name": "category1 name",
      "slug": "category1 slug"
    },
    {
      "name": "category2 name",
      "slug": "category2 slug"
    }
  ],
  "posts": [
    {
      "title": "post1 title",
      "slug": "post1 slug",
      "text": "post1 text",
      "summary": "post1 summary",
      "allowComment": true,
      "modified": "2015-01-01T00:00:00.000Z",
      "created": "2015-01-01T00:00:00.000Z",
      "copyright": true,
      "view": {
        "like": 0,
        "read": 0
      },
      "pin": "Date",
      "pinOrder": 0,
      "tags": [
        "tag1",
        "tag2"
      ],
      "category": "category1 slug"
    }
  ],
  "pages": [
    {
      "title": "page1 title",
      "subtitle": "page1 subtitle",
      "slug": "page1 slug",
      "text": "page1 text",
      "summary": "page1 summary",
      "order": 0,
      "allowComment": true,
      "modified": "2015-01-01T00:00:00.000Z",
      "created": "2015-01-01T00:00:00.000Z"
    }
  ],
  "comments": [
    {
      "ref_type": "Post",
      "ref": "post1 slug",
      "author": "comment author",
      "email": "comment email",
      "text": "comment text",
      "urls": "comment author urls",
      "status": 0,
      "ip": "comment ip",
      "agent": "comment agent",
      "key": "#1",
      "created": "2015-01-01T00:00:00.000Z",
      "children": [
        {
          "ref_type": "Post",
          "ref": "post1 slug",
          "author": "comment author",
          "email": "comment email",
          "text": "comment text",
          "urls": "comment author urls",
          "status": 0,
          "ip": "comment ip",
          "agent": "comment agent",
          "key": "#1",
          "created": "2015-01-01T00:00:00.000Z",
          "children": [
            {}
          ]
        }
      ]
    }
  ]
}

 */

interface Site {
  name: string;
  keywords?: string[];
  description?: string;
}

interface Master {
  name: string;
  username: string;
  mail?: string;
  avatar?: string;
  url?: string;
  password: string;
}

interface Category {
  name: string;
  slug: string;
}

interface Post {
  title: string;
  slug: string;
  text: string;
  summary?: string;
  allowComment: boolean;
  modified?: string;
  created: string;
  copyright: boolean;
  view?: {
    like: number;
    read: number;
  };
  pin?: string;
  pinOrder?: number;
  tags?: string[];
  category: string;
}

interface Page {
  title: string;
  subtitle?: string;
  slug: string;
  text: string;
  summary?: string;
  order?: number;
  allowComment: boolean;
  modified?: string;
  created: string;
}

interface Comment {
  ref_type: "Post" | "Page";
  ref: string;
  author: string;
  email: string;
  text: string;
  urls?: string;
  status: 0 | 1 | 2;
  ip?: string;
  agent?: string;
  created: string;
  children?: Comment[];
}

export interface BackupInterface {
  site: Required<Site>;
  master: Required<Master>;
  categories: Category[];
  posts: Post[];
  pages: Page[];
  comments: Comment[];
}
