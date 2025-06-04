(function($){

  // ==============================================================
  // スムーズスクロール
  // 使用法: HTML
  // <a href="#target"></a>
  // <div id="target"></div>
  // ==============================================================
  $('a[href^="#"]').not('.noscroll').click(function() {
    var speed = 400;
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $('body,html').animate({scrollTop:position}, speed, 'swing');
    return false;
  });

  // ==============================================================
  // タグの点滅
  // 使用法: HTML
  // <button class="blink"></button>
  // ==============================================================
  setInterval(function(){
    $('.blink').fadeOut(1200, function(){$(this).fadeIn(200)});
  }, 1400);

  // ==============================================================
  // 画像の遅延ロード
  // 使用法: HTML
  // <img class="lazyload" data-original="img/example.jpg" width="765" height="574" alt="">
  // ==============================================================
  if ($('img.lazyload').length > 0) {
    $('img.lazyload').lazyload();
  }

  // ==============================================================
  // マウスオーバーによる画像スワップ
  // 使用法: HTML
  // <img src="images/example_off.jpg" alt="">
  // <input type="image" src="images/example_off.jpg">
  // ==============================================================
  $('img, input[type="image"]').hover(function(){
      $(this).attr('src', $(this).attr('src').replace('_off.', '_on.'));
    }, function(){
      $(this).attr('src', $(this).attr('src').replace('_on.', '_off.'));
    }
  );

  // ==============================================================
  // 可視範囲に入ったときのエフェクト
  // 使用法: HTML
  // <div class="feedInUp"></div>
  // ==============================================================
  /*
	$('.feedInUp').on('inview', function(event, isInView, visiblePartX, visiblePartY) {
		if(isInView){
			$(this).stop().addClass('feedInUp_On');
		}
		else{
			$(this).stop().removeClass('feedInUp_On');
		}
	});
	*/
	var offset = 0;
	$(window).on('scroll resize load', function(e){
		var scrTop = $(this).scrollTop();
		var winHeight = $(this).height();
		$('.feedInUp').each(function(e){
			var elmTop = $(this).offset().top;
			if (scrTop > elmTop - winHeight + offset) {
				$(this).addClass('feedInUp_On');
			} else {
				$(this).removeClass('feedInUp_On');
			}
		});
	});

  // ==============================================================
  // フォームの同意確認制御
  // ==============================================================
  $('#UserAcceptance').on('change', function(e) {
    // 同意チェックあり
    if(e.target.checked) {
      // 送信ボタンを有効化
      $('.submit').attr('disabled', false);
    }
    // 同意チェックなし
    else {
      // 送信ボタンを無効化
      $('.submit').attr('disabled', true);
    }
  });

})(jQuery);


/*====================================================================================================
*
*   スクロール後に下に固定ボタン出現
*
====================================================================================================*/
$(function () {
  var topBtn = $('.fix_btn');
  topBtn.hide(); // 初期状態でボタンを隠す

  $(window).scroll(function () {
      var scrollAmount = $(window).scrollTop();

      if (scrollAmount > 100) { // スクロール位置が100より大きい場合にボタンを表示
          topBtn.fadeIn();
      } else {
          topBtn.fadeOut();
      }
  });
});




/*====================================================================================================
*
*   CTAに見ている日から3日後の最終日を自動的に表示するように設定
*
====================================================================================================*/
function updateEndDate() {
  const today = new Date();
  
  // 見ている日から3日後の日付を取得
  const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

  // 曜日の配列
  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  const dayOfWeek = daysOfWeek[threeDaysLater.getDay()];

  // 日付のフォーマットを作成
  const formattedDate = `${threeDaysLater.getMonth() + 1}月${threeDaysLater.getDate()}日（${dayOfWeek}）`;

  // クラス「end-date」を持つすべての要素を取得し、日付を設定
  const endDateElements = document.querySelectorAll(".end-date");
  endDateElements.forEach(element => {
    element.textContent = formattedDate + " 23:59";
  });
}

// ページ読み込み時に実行
updateEndDate();


/*====================================================================================================
*
* スライダー(slick.js)
*
*    slick.jsのオプション設定参考
*    https://qiita.com/ymeeto/items/7fc56eea4bd44487cdb7
*
====================================================================================================*/

$(function () {
	// スリック設定
	$('.slider').slick({
		autoplay: true, // 自動再生をONにするか否か
		autoplaySpeed: 0, // 一時停止なしで連続的に動作させる
    speed: 100,            // スライド切り替え速度 (0.5秒)
		dots: false, // 下部に各スライドに移動するドットを表示するか否か
		arrows: false, // 矢印を表示するか否か
		fade: false, // フェードでの切り替えにするか否か
		speed: 5000, // スライド切り替えにかける時間 (ms)
		slidesToShow: 3, // 表示するスライド数
		slidesToScroll: 1, // 一度にスライドする数
		centerMode: true, // 隣り合うスライドの端を表示するか否か
		focusOnSelect: true, // 真ん中のコンテンツ以外をクリックすると、真ん中まで移動
		pauseOnFocus: true, // スライドにフォーカスしている間、スライダーを止める
		pauseOnHover: true, // スライドにホバーしている間、スライダーを止める
		pauseOnDotsHover: true, // ドットにホバーしている間、スライダーを止める
		adaptiveHeight: false, // 高さを可変にするか
		cssEase: 'linear', // スライドの滑らかさを線形に
		responsive: [
			{
				breakpoint: 900,
				settings: {
					centerMode: false,
				}
			},
		]
	});

  slider.on('click', function (e) {
    e.preventDefault(); // 他のイベントの影響を防ぐ
    slider.slick('slickPause'); // 即座に停止
});
});