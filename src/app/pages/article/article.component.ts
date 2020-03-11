import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.sass']
})
export class ArticleComponent implements OnInit {

  content: string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pretium risus leo, nec rhoncus dolor pretium sed. Nulla in odio eget lorem mattis mollis at id nulla. Vestibulum in malesuada mauris, a volutpat arcu. Etiam facilisis gravida sem in efficitur. Praesent cursus leo id accumsan faucibus. Proin scelerisque dui non felis iaculis, ullamcorper ullamcorper nisi feugiat. Integer a egestas purus. Aenean ut enim nec nunc accumsan sodales quis vel purus. Mauris ligula ipsum, pharetra vel congue luctus, ornare a felis. Ut rutrum diam sem, at ultricies urna placerat id. Suspendisse convallis, nulla ac malesuada hendrerit, augue ex fermentum purus, non convallis nisi nisl a ex. Nam porttitor viverra dui, ut tempus turpis molestie nec. Nullam eget neque nec lectus dictum volutpat et et est. Proin ut metus turpis.
  <p>
  Sed gravida mauris et neque mattis consequat. Cras posuere ullamcorper dolor in tincidunt. Nulla eu ex vitae magna convallis rhoncus non at magna. In ultricies arcu sed eros scelerisque, vel porta metus cursus. Ut varius id risus sit amet varius. Proin non aliquet nunc. In accumsan, metus et porttitor ornare, leo quam interdum ex, at pretium massa est a nunc. Sed diam lacus, semper sit amet dolor eu, maximus varius magna. Suspendisse in consectetur elit.
  <div class="articleimg">
    <img src="https://www.akc.org/wp-content/themes/akc/component-library/assets/img/welcome.jpg">
    <p>Dies ist eine Bildunterschrift</p>
    </div>
  <p>
  <a href="google.de">Dies ist ein Link</a>
  In sed quam eget nulla gravida gravida. Duis elit neque, tincidunt eu mauris et, congue semper urna. In eros purus, sodales at dui sit amet, porttitor vehicula nisi. Suspendisse lacinia eu ipsum at cursus. Duis a dui quis erat mattis sodales. Cras molestie quam lorem, et porta massa ornare non. Ut pharetra augue non sodales pharetra. In accumsan sit amet dolor sit amet gravida.
  <div class="quote">
  DIES IST EIN SINNVOLLES ZITAT
  <p>
  Wir leben in einem gefährlichen Zeitalter. Der Mensch beherrscht die Natur, bevor er gelernt hat, sich selbst zu beherrschen.
  </div>
  <p>
  Donec sed condimentum erat. Proin congue blandit molestie. Fusce blandit vestibulum libero, vel tempor sapien. Nullam in bibendum magna. Cras in feugiat mauris. Vivamus iaculis augue nisl, quis volutpat arcu tincidunt ac. Aenean ante odio, malesuada sit amet molestie ut, dapibus ac tortor. Pellentesque fringilla varius massa, id sollicitudin massa porta at. Aliquam imperdiet felis nec aliquam pellentesque. Donec tincidunt, arcu in pretium ullamcorper, mi eros molestie ante, a sagittis massa lacus vitae ante.
  <p>
  Phasellus ac neque nec metus laoreet ornare. Etiam facilisis tortor ornare, efficitur sapien sit amet, eleifend enim. Vivamus ultricies volutpat auctor. Fusce fermentum pretium libero, congue faucibus metus fringilla in. Nullam lacus metus, sollicitudin sit amet accumsan sit amet, consectetur in justo. Curabitur convallis vulputate velit in vulputate. Sed at auctor velit. Curabitur at metus massa. Integer mollis non leo et condimentum. Aenean ut lacinia neque. Donec luctus blandit pulvinar. Aliquam sed gravida lorem. Sed fermentum rhoncus egestas. Nunc sit amet mauris nec est vulputate laoreet. Etiam scelerisque eget nulla et tincidunt. Duis ut felis vitae odio pretium tempus vitae mollis justo.`;

  constructor() { }

  ngOnInit(): void {
  }

}
