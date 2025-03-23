import { audio } from './audio.js';
import { theme } from './theme.js';
import { comment } from './comment.js';
import { storage } from './storage.js';
import { request, HTTP_GET } from './request.js';

export const util = (() => {

    const opacity = (id, speed = 0.01) => {
        const element = document.getElementById(id);
        let op = parseInt(element.style.opacity);

        let clear = null;
        clear = setInterval(() => {
            if (op > 0) {
                element.style.opacity = op.toString();
                op -= speed;
            } else {
                clearInterval(clear);
                clear = null;
                element.remove();
            }
        }, 10);
    };

    const escapeHtml = (unsafe) => {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const disableButton = (button, message = 'Loading..') => {

        button.disabled = true;
        let tmp = button.innerHTML;
        button.innerHTML = message;

        const restore = () => {
            button.innerHTML = tmp;
            button.disabled = false;
        };

        return {
            restore,
        };
    };

    const animate = (svg, timeout, classes) => {
        let handler = null;
        handler = setTimeout(() => {
            svg.classList.add(classes);
            handler = null;
        }, timeout);
    };

    const guest = () => {
        const name = (new URLSearchParams(window.location.search)).get('to');

 
        const reqeustMsg = `<div class="card-body border rounded-4 shadow p-3 m-3 aos-init aos-animate" data-aos="fade-left" data-aos-duration="1500" ><h1 class="sectionHead ft-gowundodum" >사랑이 가득 담긴 쌀 화환</h1> <p class="ft-gowundodum mt-3 mb-4" style="font-size: 1rem;">
        저희의 새로운 출발을<br>
        축하해 주시는 마음을<br>
        쌀로 보내주시면, <br>
        이를 소중한 곳에 기부하여<br>
        더욱 뜻깊은 결혼식으로 만들겠습니다.
        </p></div>`

        document.getElementById('req-message').innerHTML = reqeustMsg;
        return;
    };

 

    const show = () => {
        guest();
        opacity('loading', 0.025);
        window.scrollTo(0, 0);
    };

    const modal = (element) => {

        const backgroundImage = element.style.backgroundImage;
        // url() 포맷에서 URL을 추출
        const urlMatch = backgroundImage.match(/url\("(.+)"\)/);
        const imageUrl = urlMatch ? urlMatch[1] : '';

        
        document.getElementById('show-modal-image').src = imageUrl;
        (new bootstrap.Modal('#modal-image')).show();
    };

    const countDownDate = () => {
        const until = document.getElementById('count-down').getAttribute('data-time').replace(' ', 'T');
        const count = (new Date(until)).getTime();

        setInterval(() => {
            const distance = Math.abs(count - (new Date()).getTime());

            document.getElementById('day').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
            document.getElementById('hour').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById('minute').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('second').innerText = Math.floor((distance % (1000 * 60)) / 1000);
        }, 1000);
    };

    const copy = async (button, message, timeout = 1500) => {
        try {
            await navigator.clipboard.writeText(button.getAttribute('data-copy'));
        } catch {
            alert('Failed to copy');
            return;
        }

        button.disabled = true;
        let tmp = button.innerText;
        button.innerText = message;

        let clear = null;
        clear = setTimeout(() => {
            button.disabled = false;
            button.innerText = tmp;

            clearTimeout(clear);
            clear = null;
            return;
        }, timeout);
    };

    const animation = () => {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = ["#FFC0CB", "#FF1493", "#C71585"];

        const randomInRange = (min, max) => {
            return Math.random() * (max - min) + min;
        };

        const heart = confetti.shapeFromPath({
            path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
            matrix: [0.03333333333333333, 0, 0, 0.03333333333333333, -5.566666666666666, -5.533333333333333]
        });

        (function frame() {
            const timeLeft = animationEnd - Date.now();

            colors.forEach((color) => {
                confetti({
                    particleCount: 1,
                    startVelocity: 0,
                    ticks: Math.max(50, 75 * (timeLeft / duration)),
                    origin: {
                        x: Math.random(),
                        y: Math.abs(Math.random() - (timeLeft / duration)),
                    },
                    zIndex: 1057,
                    colors: [color],
                    shapes: [heart],
                    drift: randomInRange(-0.5, 0.5),
                    gravity: randomInRange(0.5, 1),
                    scalar: randomInRange(0.5, 1),
                });
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        })();
    };

    const storeConfig = async (token) => {
        storage('session').set('token', token);

        const config = storage('config');
        return await request(HTTP_GET, '/api/config')
            .token(token)
            .then((res) => {
                for (let [key, value] of Object.entries(res.data)) {
                    config.set(key, value);
                }

                return res.code;
            });
    };
    const send = async (button) =>{

        var form = document.getElementById('phonenumber').value;
    
        console.log(form);
        button.disabled = true;
        confetti({
            origin: { y: 1 },
            zIndex: 1057
        });

        theme.check();
        AOS.init();
        audio.play();
        document.querySelector('body').style.overflowY = 'scroll';

        if (localStorage.getItem('alertClosed')) {
            document.getElementById('information').style.display = 'none';
        }
        countDownDate();
        audio.showButton();
        document.getElementById('button-theme').style.display = 'block';

        const token = document.querySelector('body').getAttribute('data-key');
        const status = await storeConfig(token);
        if (status === 200) {
            animation();
            comment.comment();
        }
        event.preventDefault(); 

    }
    const open = async (button) => {
        button.disabled = true;
        confetti({
            origin: { y: 1 },
            zIndex: 1057
        });

        theme.check();
        AOS.init();
        audio.play();
        document.querySelector('body').style.overflowY = 'scroll';

        if (localStorage.getItem('alertClosed')) {
            document.getElementById('information').style.display = 'none';
        }

        opacity('welcome', 0.025);
        countDownDate();
        audio.showButton();
        document.getElementById('button-theme').style.display = 'block';

        const token = document.querySelector('body').getAttribute('data-key');
        const status = await storeConfig(token);
        if (status === 200) {
            animation();
            comment.comment();
        }
    };

    return {
        open,
        send,
        copy,
        show,
        modal,
        opacity,
        animate,
        animation,
        escapeHtml,
        countDownDate,
        disableButton,
    }
})();