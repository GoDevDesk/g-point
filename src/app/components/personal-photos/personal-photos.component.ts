import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-photos',
  templateUrl: './personal-photos.component.html',
  styleUrls: ['./personal-photos.component.scss']
})
export class PersonalPhotosComponent {
  reels = [
    {
      images: [
        'https://images.pexels.com/photos/458766/pexels-photo-458766.jpeg',
        'https://images.pexels.com/photos/247287/pexels-photo-247287.jpeg',
        'https://images.pexels.com/photos/6169/woman-hand-girl-professional.jpg',
      ],
      currentImageIndex: 0,
      likes: 0,
      liked: false,
    },
    {
      images: [
        'https://images.pexels.com/photos/3851790/pexels-photo-3851790.jpeg',
        'https://images.pexels.com/photos/3852159/pexels-photo-3852159.jpeg',
        'https://images.pexels.com/photos/4491173/pexels-photo-4491173.jpeg',
      ],
      currentImageIndex: 0,
      likes: 0,
      liked: false,
    },
    {
      images: [
        'https://images.pexels.com/photos/2294354/pexels-photo-2294354.jpeg',
        'https://images.pexels.com/photos/6019812/pexels-photo-6019812.jpeg',
        'https://images.pexels.com/photos/40751/running-runner-long-distance-fitness-40751.jpeg',
      ],
      currentImageIndex: 0,
      likes: 0,
      liked: false,
    },
  ];

  likeReel(reelIndex: number) {
    const reel = this.reels[reelIndex];
    reel.liked = !reel.liked;
    reel.likes += reel.liked ? 1 : -1;
  }

  nextImage(reelIndex: number) {
    const reel = this.reels[reelIndex];
    reel.currentImageIndex = (reel.currentImageIndex + 1) % reel.images.length;
  }

  prevImage(reelIndex: number) {
    const reel = this.reels[reelIndex];
    reel.currentImageIndex =
      (reel.currentImageIndex - 1 + reel.images.length) % reel.images.length;
  }
}
