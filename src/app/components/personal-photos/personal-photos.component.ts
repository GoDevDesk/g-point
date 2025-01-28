import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-photos',
  templateUrl: './personal-photos.component.html',
  styleUrls: ['./personal-photos.component.scss']
})
export class PersonalPhotosComponent {
  posts = [
    {
      username: '8fact',
      profilePictureUrl: 'https://picsum.photos/id/1027/150/150',
      location: 'Asheville, North Carolina',
      imageUrl: 'https://picsum.photos/id/244/900/900',
      likes: 92372
    },
    {
      username: 'JohnDoe',
      profilePictureUrl: 'https://picsum.photos/id/1012/150/150',
      location: 'San Francisco, California',
      imageUrl: 'https://picsum.photos/id/1020/900/900',
      likes: 12345
    }
  ];
}
