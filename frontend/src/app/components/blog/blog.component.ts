import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingBlogs = false;

  constructor() { }

  reloadBlogs() {
    this.loadingBlogs = true;
    // Get all Blogs
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 3000);
  }

  newBlogForm() {
    this.newPost = true;
  }

  draftComment() {

  }

  ngOnInit() {
  }

}
