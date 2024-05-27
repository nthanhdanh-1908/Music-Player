const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: 'Buông Hàng',
            singer: 'Singer',
            path: 'assets/musics/BuongHang.mp3',
            image: 'assets/img/img.jpg'
        },
        {
            name: 'Đoạn Tuyệt Nàng Đi',
            singer: 'Singer',
            path: 'assets/musics/DoanTuyetNangDi.mp3',
            image: 'assets/img/img.jpg'
        },
        {
            name: 'Đừng Ai Nhắc Về Cô Ấy',
            singer: 'Singer',
            path: 'assets/musics/DungAiNhacVeCoAy.mp3',
            image: 'assets/img/img.jpg'
        },
        {
            name: 'Em Hát Ai Nghe',
            singer: 'Singer',
            path: 'assets/musics/EmHatAiNghe.mp3',
            image: 'assets/img/img.jpg'
        },
        {
            name: 'Freeman x Low',
            singer: 'Singer',
            path: 'assets/musics/FreemanXLow.mp3',
            image: 'assets/img/img.jpg'
        },
        {
            name: 'GANGSTA WALK x HIP',
            singer: 'Singer',
            path: 'assets/musics/GANGSTAWALKxHIP.mp3',
            image: 'assets/img/img.jpg'
        },
        {
            name: 'Gods Thereon Remix',
            singer: 'Singer',
            path: 'assets/musics/GodsThereon.mp3',
            image: 'assets/img/img.jpg'
        },
        {
            name: 'HỘI PHÁP SƯ FAIRY TAIL ',
            singer: 'Singer',
            path: 'assets/musics/HoiPhapSu.mp3',
            image: 'assets/img/img.jpg'
        },
        {
            name: 'Mười Năm Nhân Gian Remix',
            singer: 'Singer',
            path: 'assets/musics/MuoiNamDanGian.mp3',
            image: 'assets/img/img.jpg'
        },
        {
            name: 'Oh Oh Oh Fix',
            singer: 'Singer',
            path: 'assets/musics/OhOhOh.mp3',
            image: 'assets/img/img.jpg'
        },
        {
            name: 'MusicMix ',
            singer: 'Singer',
            path: 'assets/musics/MusicMix.mp3',
            image: 'assets/img/img.jpg'
        },
        {
            name: 'THỦ ĐÔ CYPHER',
            singer: 'Singer',
            path: 'assets/musics/ThuDoCypher.mp3',
            image: 'assets/img/img.jpg'
        },
        {
            name: 'Trúc Xinh',
            singer: 'Singer',
            path: 'assets/musics/TrucXinh.mp3',
            image: 'assets/img/img.jpg'
        }
    ],
    
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}');">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>

                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {   
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xu li CD quay / dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        
        // Xu li phong to / thu nho CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0 
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xu li khi click play
        playBtn.onclick = () => _this.isPlaying == true ? audio.pause() : audio.play()

        // Khi bai hat duoc player
        audio.onplay = () => {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi bai hat duoc pause 
        audio.onpause = () => {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tien do bai hat thay doi
        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xu li khi tua bai hat
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next bai hat
        nextBtn.onclick = () => {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            this.render()
            this.scrollToActiveSong()
        }

        // Khi prev bai hat
        prevBtn.onclick = () => {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            this.render()
            this.scrollToActiveSong()
        }

        // Xu li on / off random
        randomBtn.onclick = (e) => {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xu li lap lai 1 bai hat
        repeatBtn.onclick = (e) => {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xu li next song khi bai hat ended
        audio.onended = () => {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lang nghe hanh vi click vao playlist
        playlist.onclick = (e) => {
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('.option')){
                // Xu li khi click vao bai hat
                if (songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex > this.songs.length - 1){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex <= 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // Gan cau hinh tu Config vao ung dung
        this.loadConfig()

        // Dinh nghia cac thuoc tinh cho Object
        this.defineProperties()

        // Lang nghe, xu li cac su kien (DOM events)
        this.handleEvents()

        // Tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()

        // Render playlist
        this.render()    

        // Hien thi trang thai ban dau cua button repeat && random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()