class Game {
    constructor() {
        this.scenes = ['opening-scene', 'wind-scene', 'note-scene', 'dialog-scene'];
        this.currentSceneIndex = 0;
        this.backgroundMusic = document.getElementById('background-music');
        this.hasShownExtendedDialog = false; // 用于标记是否已经显示过扩展对话

        this.initializeGame();
    }

    initializeGame() {
        this.setupEventListeners();
        this.showCurrentScene();
        this.playBackgroundMusic();
    }

    setupEventListeners() {
        // 场景切换按钮
        document.querySelectorAll('.next-button').forEach(button => {
            button.addEventListener('click', () => this.nextScene());
        });

        // 对话选项按钮
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleOptionClick(e));
        });
    }

    showCurrentScene() {
        // 隐藏所有场景
        document.querySelectorAll('.scene').forEach(scene => {
            scene.classList.remove('active');
        });

        // 显示当前场景
        const currentScene = document.getElementById(this.scenes[this.currentSceneIndex]);
        currentScene.classList.add('active');

        // 根据场景调整音乐
        this.adjustMusicForScene();
    }

    nextScene() {
        this.currentSceneIndex++;
        if (this.currentSceneIndex < this.scenes.length) {
            this.showCurrentScene();
        }
    }

    handleOptionClick(event) {
        const option = event.target.dataset.option;
        const dialogText = document.querySelector('.dialog-text');
        const panda = document.querySelector('.panda');
        const options = document.querySelector('.options');

        switch (option) {
            case 'A':
                dialogText.textContent = '太好了！让我们一起开始冒险吧！';
                panda.classList.add('bounce');
                // 跳转到guanqia1.html
                setTimeout(() => {
                    window.location.href = 'guanqia1.html';
                }, 1500);
                break;
            case 'B':
                dialogText.textContent = '当然可以！我们一起合作，一定能找到苹果！';
                // 跳转到guanqia1.html
                setTimeout(() => {
                    window.location.href = 'guanqia1.html';
                }, 1500);
                break;
            case 'C':
                if (!this.hasShownExtendedDialog) {
                    // 第一次选择C，显示扩展对话
                    dialogText.textContent = '其实...这些苹果是我送给妈妈的生日礼物。妈妈说，如果我学会分享，就会变得更勇敢。';
                    options.style.display = 'none'; // 隐藏选项
                    this.hasShownExtendedDialog = true;

                    setTimeout(() => {
                        dialogText.textContent = '你愿意帮我吗？';
                        options.style.display = 'block'; // 重新显示选项

                        // 重置按钮文本
                        document.querySelector('[data-option="A"]').textContent = '我一定帮你找到苹果！';
                        document.querySelector('[data-option="B"]').textContent = '我试试看，但需要你的帮助哦！';
                        document.querySelector('[data-option="C"]').textContent = '为什么要我帮？';
                    }, 3000);
                } else {
                    // 如果已经显示过扩展对话，直接跳转
                    setTimeout(() => {
                        window.location.href = 'guanqia1.html';
                    }, 1500);
                }
                break;
        }

        // 如果不是第一次显示扩展对话，则隐藏选项（除了选项C的第二次选择）
        if (option !== 'C' && this.hasShownExtendedDialog) {
            options.style.display = 'none';
        }
    }

    playBackgroundMusic() {
        // 设置音量并自动播放
        this.backgroundMusic.volume = 0.5; // 设置音量为50%

        // 检查浏览器是否允许自动播放
        this.backgroundMusic.play().catch(error => {
            console.log('自动播放失败:', error);
            // 如果自动播放失败，可能需要用户交互后才能播放
            this.setupManualPlay();
        });

        // 添加淡入效果
        this.fadeInMusic();
    }

    setupManualPlay() {
        // 添加一个按钮，允许用户手动播放音乐
        const playButton = document.createElement('button');
        playButton.id = 'play-music';
        playButton.textContent = '播放背景音乐';
        document.body.appendChild(playButton);

        playButton.addEventListener('click', () => {
            this.backgroundMusic.play().then(() => {
                playButton.style.display = 'none';
                this.fadeInMusic();
            }).catch(error => {
                console.log('播放失败:', error);
            });
        });
    }

    fadeInMusic() {
        let currentVolume = 0;
        const targetVolume = 0.5;
        const fadeDuration = 2000; // 淡入时间（毫秒）
        const increment = targetVolume / (fadeDuration / 100);
        const fadeInterval = setInterval(() => {
            currentVolume += increment;
            this.backgroundMusic.volume = currentVolume;

            if (currentVolume >= targetVolume) {
                clearInterval(fadeInterval);
                this.backgroundMusic.volume = targetVolume;
            }
        }, 100);
    }

    fadeOutMusic() {
        let currentVolume = this.backgroundMusic.volume;
        const fadeDuration = 1000; // 淡出时间（毫秒）
        const decrement = currentVolume / (fadeDuration / 100);

        const fadeInterval = setInterval(() => {
            currentVolume -= decrement;
            this.backgroundMusic.volume = currentVolume;

            if (currentVolume <= 0) {
                clearInterval(fadeInterval);
                this.backgroundMusic.pause();
                this.backgroundMusic.volume = 0;
            }
        }, 100);
    }

    adjustMusicForScene() {
        // 根据场景调整背景音乐
        const currentSceneId = this.scenes[this.currentSceneIndex];

        // 为不同场景设置不同的音乐效果
        if (currentSceneId === 'wind-scene') {
            this.fadeOutMusic();
            setTimeout(() => {
                this.backgroundMusic.volume = 0.3; // 调低音量
                this.backgroundMusic.play();
            }, 1000);
        } else if (currentSceneId === 'dialog-scene') {
            this.fadeOutMusic();
            setTimeout(() => {
                this.backgroundMusic.volume = 0.7; // 调高音量
                this.backgroundMusic.play();
            }, 1000);
        } else {
            this.backgroundMusic.volume = 0.5; // 默认音量
        }
    }
}

// 初始化游戏
window.addEventListener('load', () => {
    // 创建音频元素
    const audioElement = document.createElement('audio');
    audioElement.id = 'background-music';
    audioElement.loop = true;

    // 设置音频源
    const source = document.createElement('source');
    source.src = 'sounds/bgc.mp3';
    source.type = 'audio/mpeg';

    audioElement.appendChild(source);
    document.body.appendChild(audioElement);

    // 初始化游戏
    new Game();
});