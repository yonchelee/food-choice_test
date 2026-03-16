// 상태 관리
let state = {
    peopleCount: 5,
    location: null,
    menu: null
};

// 지도 관련 변수
let map;
let markers = {};

// 위치 좌표 데이터
const locationCoordinates = {
    '홍대': [37.5568, 126.9239],
    '강남': [37.5172, 127.0473],
    '신촌': [37.5551, 126.9367],
    '건대': [37.5400, 127.0701],
    '수원 영통': [37.2887, 127.0466],
    '종로': [37.5700, 126.9768]
};

// 지도 초기화
function initMap() {
    // 서울 중심으로 지도 생성
    map = L.map('map').setView([37.5568, 126.9239], 12);
    
    // OpenStreetMap 타일 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // 각 위치에 마커 추가
    Object.entries(locationCoordinates).forEach(([location, coords]) => {
        // 커스텀 아이콘 생성
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                white-space: nowrap;
                border: 3px solid white;
            ">📍 ${location}</div>`,
            iconSize: [100, 40],
            iconAnchor: [50, 20]
        });
        
        const marker = L.marker(coords, { icon: customIcon }).addTo(map);
        markers[location] = marker;
        
        // 마커 클릭 이벤트
        marker.on('click', () => {
            selectLocation(location);
        });
    });
}

// 페이지 로드 시 지도 초기화
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    // 초기 사람 아이콘 표시
    updatePeopleAnimation(state.peopleCount);
});

// 인원 선택 기능
const peopleCountInput = document.getElementById('people-count');
const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');

decreaseBtn.addEventListener('click', () => {
    if (state.peopleCount > 1) {
        state.peopleCount--;
        peopleCountInput.value = state.peopleCount;
        updatePeopleAnimation(state.peopleCount);
    }
});

increaseBtn.addEventListener('click', () => {
    if (state.peopleCount < 50) {
        state.peopleCount++;
        peopleCountInput.value = state.peopleCount;
        updatePeopleAnimation(state.peopleCount);
    }
});

peopleCountInput.addEventListener('change', (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) value = 1;
    if (value > 50) value = 50;
    state.peopleCount = value;
    peopleCountInput.value = value;
    updatePeopleAnimation(state.peopleCount);
});

// 위치 선택 기능
const locationBtns = document.querySelectorAll('.location-btn');
const currentLocationSpan = document.getElementById('current-location');

function selectLocation(location) {
    state.location = location;
    currentLocationSpan.textContent = location;
    
    // 버튼 스타일 업데이트
    locationBtns.forEach(btn => {
        if (btn.dataset.location === location) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 지도에서 선택한 위치로 이동 및 확대
    if (map && locationCoordinates[location]) {
        const coords = locationCoordinates[location];
        map.setView(coords, 14);
        
        // 마커 하이라이트 효과
        Object.entries(markers).forEach(([loc, marker]) => {
            const icon = marker.getIcon();
            if (loc === location) {
                // 선택된 마커
                marker.setIcon(L.divIcon({
                    className: 'custom-marker selected',
                    html: `<div style="
                        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                        color: white;
                        padding: 10px 20px;
                        border-radius: 25px;
                        font-weight: bold;
                        font-size: 16px;
                        box-shadow: 0 6px 20px rgba(240, 147, 251, 0.6);
                        white-space: nowrap;
                        border: 4px solid white;
                        transform: scale(1.1);
                    ">📍 ${location}</div>`,
                    iconSize: [110, 45],
                    iconAnchor: [55, 22]
                }));
            } else {
                // 선택되지 않은 마커
                marker.setIcon(L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-weight: bold;
                        font-size: 14px;
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                        white-space: nowrap;
                        border: 3px solid white;
                    ">📍 ${loc}</div>`,
                    iconSize: [100, 40],
                    iconAnchor: [50, 20]
                }));
            }
        });
    }
}

locationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        selectLocation(btn.dataset.location);
    });
});

// 메뉴 선택 기능
const menuCards = document.querySelectorAll('.menu-card');
const currentMenuSpan = document.getElementById('current-menu');

function selectMenu(menu) {
    state.menu = menu;
    currentMenuSpan.textContent = menu;
    
    menuCards.forEach(card => {
        if (card.dataset.menu === menu) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

menuCards.forEach(card => {
    card.addEventListener('click', () => {
        selectMenu(card.dataset.menu);
    });
});

// 검색 버튼 기능
const searchBtn = document.getElementById('search-btn');
const resultDiv = document.getElementById('result');

searchBtn.addEventListener('click', () => {
    if (!state.location) {
        resultDiv.innerHTML = '<p style="color: #e74c3c; font-weight: bold;">⚠️ 위치를 선택해주세요!</p>';
        return;
    }
    
    // 즉시 결과 표시
    displayImmediateResults();
});

function displayImmediateResults() {
    // 추천 식당 생성
    const recommendations = generateRecommendations();
    
    // 결과 표시
    displayResults(recommendations);
}

function generateRecommendations() {
    const recommendations = [];
    
    // 위치와 메뉴에 따른 식당 데이터 (데모용)
    const restaurantData = {
        '홍대': {
            '한식': [
                { name: '홍대 소고기마을', capacity: 30, price: '3~5만원', rating: 4.5 },
                { name: '전주담갱집', capacity: 20, price: '2~4만원', rating: 4.3 }
            ],
            '중식': [
                { name: '마라탕 홍대점', capacity: 25, price: '1~2만원', rating: 4.6 },
                { name: '홍대 짜장면', capacity: 15, price: '8천~1.5만원', rating: 4.2 }
            ],
            '일식': [
                { name: '스시도코 홍대', capacity: 20, price: '2~4만원', rating: 4.7 },
                { name: '라멘카츠', capacity: 25, price: '1~2만원', rating: 4.4 }
            ],
            '양식': [
                { name: '파스타하우스', capacity: 30, price: '2~4만원', rating: 4.5 },
                { name: '스테이크 레스토랑', capacity: 40, price: '5~8만원', rating: 4.6 }
            ],
            '치킨': [
                { name: '홍대 치킨마을', capacity: 20, price: '1.8~2.5만원', rating: 4.4 },
                { name: 'BBQ 홍대점', capacity: 25, price: '2~3만원', rating: 4.3 }
            ],
            '구이류': [
                { name: '홍대 갈비촌', capacity: 35, price: '3~5만원', rating: 4.6 },
                { name: '삼겹살 홍대', capacity: 30, price: '2~4만원', rating: 4.5 }
            ],
            '회': [
                { name: '홍대 광어회', capacity: 40, price: '3~5만원', rating: 4.7 },
                { name: '연어회 홍대', capacity: 35, price: '4~6만원', rating: 4.6 }
            ]
        },
        '강남': {
            '한식': [
                { name: '강남 갈비촌', capacity: 40, price: '4~6만원', rating: 4.6 },
                { name: '서울불고기', capacity: 35, price: '3~5만원', rating: 4.4 }
            ],
            '중식': [
                { name: '마라탕 강남점', capacity: 30, price: '1~2만원', rating: 4.5 },
                { name: '중화요리 강남', capacity: 50, price: '2~4만원', rating: 4.3 }
            ],
            '일식': [
                { name: '스시강남', capacity: 25, price: '3~5만원', rating: 4.8 },
                { name: '라멘스튜디오', capacity: 20, price: '1.5~2.5만원', rating: 4.5 }
            ],
            '양식': [
                { name: '이탈리안 레스토랑', capacity: 45, price: '3~6만원', rating: 4.7 },
                { name: '강남 스테이크하우스', capacity: 50, price: '6~10만원', rating: 4.6 }
            ],
            '치킨': [
                { name: '강남 치킨타운', capacity: 30, price: '2~3만원', rating: 4.5 },
                { name: 'BHC 강남점', capacity: 35, price: '2.5~3.5만원', rating: 4.4 }
            ],
            '구이류': [
                { name: '강남 갈비촌', capacity: 45, price: '4~6만원', rating: 4.7 },
                { name: '삼겹살 강남', capacity: 40, price: '3~5만원', rating: 4.6 }
            ],
            '회': [
                { name: '강남 광어회', capacity: 50, price: '4~6만원', rating: 4.8 },
                { name: '연어회 강남', capacity: 45, price: '5~7만원', rating: 4.7 }
            ]
        },
        '신촌': {
            '한식': [
                { name: '신촌 돼지고기', capacity: 25, price: '2~4만원', rating: 4.4 },
                { name: '전주비빔밥', capacity: 30, price: '1.5~3만원', rating: 4.3 }
            ],
            '중식': [
                { name: '마라탕 신촌', capacity: 20, price: '1~2만원', rating: 4.4 },
                { name: '신촌 짬뽕', capacity: 25, price: '8천~1.5만원', rating: 4.2 }
            ],
            '일식': [
                { name: '스시집 신촌', capacity: 18, price: '2~4만원', rating: 4.5 },
                { name: '라멘집', capacity: 22, price: '1~2만원', rating: 4.3 }
            ],
            '양식': [
                { name: '파스타 신촌', capacity: 28, price: '2~4만원', rating: 4.4 },
                { name: '피자헛 신촌', capacity: 35, price: '1.5~3만원', rating: 4.2 }
            ],
            '치킨': [
                { name: '신촌 치킨', capacity: 25, price: '1.8~2.5만원', rating: 4.3 },
                { name: '교촌치킨 신촌', capacity: 30, price: '2~3만원', rating: 4.4 }
            ],
            '구이류': [
                { name: '신촌 갈비촌', capacity: 30, price: '2.5~4.5만원', rating: 4.5 },
                { name: '삼겹살 신촌', capacity: 25, price: '2~4만원', rating: 4.4 }
            ],
            '회': [
                { name: '신촌 광어회', capacity: 35, price: '2.5~4.5만원', rating: 4.6 },
                { name: '연어회 신촌', capacity: 30, price: '3~5만원', rating: 4.5 }
            ]
        },
        '건대': {
            '한식': [
                { name: '건대 돼지구이', capacity: 30, price: '2~4만원', rating: 4.5 },
                { name: '갈비집 건대', capacity: 35, price: '3~5만원', rating: 4.4 }
            ],
            '중식': [
                { name: '마라탕 건대', capacity: 25, price: '1~2만원', rating: 4.6 },
                { name: '탕수육 건대', capacity: 30, price: '2~4만원', rating: 4.3 }
            ],
            '일식': [
                { name: '스시 건대', capacity: 22, price: '2~4만원', rating: 4.6 },
                { name: '라멘 건대', capacity: 28, price: '1~2만원', rating: 4.4 }
            ],
            '양식': [
                { name: '파스타 건대', capacity: 32, price: '2~4만원', rating: 4.5 },
                { name: '피자 건대', capacity: 40, price: '1.5~3만원', rating: 4.3 }
            ],
            '치킨': [
                { name: '건대 치킨', capacity: 28, price: '1.8~2.5만원', rating: 4.5 },
                { name: 'BBQ 건대', capacity: 35, price: '2~3만원', rating: 4.4 }
            ],
            '구이류': [
                { name: '건대 갈비촌', capacity: 35, price: '2.5~4.5만원', rating: 4.6 },
                { name: '삼겹살 건대', capacity: 30, price: '2~4만원', rating: 4.5 }
            ],
            '회': [
                { name: '건대 광어회', capacity: 40, price: '2.5~4.5만원', rating: 4.7 },
                { name: '연어회 건대', capacity: 35, price: '3~5만원', rating: 4.6 }
            ]
        },
        '수원 영통': {
            '한식': [
                { name: '영통 소고기마을', capacity: 40, price: '2~4만원', rating: 4.6 },
                { name: '수원 갈비촌', capacity: 35, price: '3~5만원', rating: 4.4 }
            ],
            '중식': [
                { name: '영통 마라탕', capacity: 30, price: '1~2만원', rating: 4.5 },
                { name: '수원 짜장면', capacity: 25, price: '8천~1.5만원', rating: 4.2 }
            ],
            '일식': [
                { name: '영통 스시', capacity: 25, price: '2~4만원', rating: 4.7 },
                { name: '수원 라멘', capacity: 20, price: '1~2만원', rating: 4.4 }
            ],
            '양식': [
                { name: '영통 파스타', capacity: 35, price: '2~4만원', rating: 4.5 },
                { name: '수원 스테이크', capacity: 45, price: '4~7만원', rating: 4.6 }
            ],
            '치킨': [
                { name: '영통 치킨타운', capacity: 30, price: '1.8~2.5만원', rating: 4.4 },
                { name: 'BHC 수원 영통점', capacity: 35, price: '2~3만원', rating: 4.3 }
            ],
            '구이류': [
                { name: '영통 갈비촌', capacity: 40, price: '2.5~4.5만원', rating: 4.6 },
                { name: '삼겹살 영통', capacity: 35, price: '2~4만원', rating: 4.5 }
            ],
            '회': [
                { name: '영통 광어회', capacity: 45, price: '2.5~4.5만원', rating: 4.7 },
                { name: '연어회 영통', capacity: 40, price: '3~5만원', rating: 4.6 }
            ]
        },
        '종로': {
            '한식': [
                { name: '종로 고기마을', capacity: 45, price: '3~5만원', rating: 4.7 },
                { name: '서울 갈비촌', capacity: 40, price: '4~6만원', rating: 4.5 }
            ],
            '중식': [
                { name: '종로 마라탕', capacity: 35, price: '1.5~2.5만원', rating: 4.6 },
                { name: '종로 중화요리', capacity: 50, price: '2~4만원', rating: 4.4 }
            ],
            '일식': [
                { name: '종로 스시', capacity: 30, price: '3~5만원', rating: 4.8 },
                { name: '종로 라멘', capacity: 25, price: '1.5~2.5만원', rating: 4.5 }
            ],
            '양식': [
                { name: '종로 파스타', capacity: 40, price: '2.5~4.5만원', rating: 4.6 },
                { name: '종로 스테이크하우스', capacity: 55, price: '5~9만원', rating: 4.7 }
            ],
            '치킨': [
                { name: '종로 치킨마을', capacity: 35, price: '2~3만원', rating: 4.5 },
                { name: 'BHC 종로점', capacity: 40, price: '2.5~3.5만원', rating: 4.4 }
            ],
            '구이류': [
                { name: '종로 갈비촌', capacity: 50, price: '3~5만원', rating: 4.7 },
                { name: '삼겹살 종로', capacity: 45, price: '2.5~4.5만원', rating: 4.6 }
            ],
            '회': [
                { name: '종로 광어회', capacity: 55, price: '3~5만원', rating: 4.8 },
                { name: '연어회 종로', capacity: 50, price: '4~6만원', rating: 4.7 }
            ]
        }
    };
    
    const locationData = restaurantData[state.location] || {};
    const menuData = locationData[state.menu] || [];
    
    // 인원에 맞는 식당 필터링
    menuData.forEach(restaurant => {
        if (restaurant.capacity >= state.peopleCount) {
            recommendations.push(restaurant);
        }
    });
    
    // 추천이 없으면 인원 제한 완화하여 추가 추천
    if (recommendations.length === 0) {
        menuData.forEach(restaurant => {
            if (recommendations.length < 3) {
                recommendations.push({
                    ...restaurant,
                    note: '(인원 초과 가능)'
                });
            }
        });
    }
    
    // 최대 3개만 반환
    return recommendations.slice(0, 3);
}

function displayResults(recommendations) {
    if (recommendations.length === 0) {
        // 결과가 없으면 네이버 검색 옵션 제공
        let searchQuery = `${state.location} 맛집`;
        if (state.menu) {
            searchQuery += ` ${state.menu}`;
        }
        const encodedQuery = encodeURIComponent(searchQuery);
        const naverSearchUrl = `https://search.naver.com/search.naver?query=${encodedQuery}&where=nexearch&sm=tab_hty.top`;
        
        resultDiv.innerHTML = `
            <div style="margin-bottom: 20px; color: #667eea; font-weight: bold; font-size: 1.2rem;">
                📍 ${state.location} | 👥 ${state.peopleCount}명 ${state.menu ? `| 🍽️ ${state.menu}` : ''}
            </div>
            <div class="result-card" style="text-align: center; padding: 30px;">
                <div style="font-size: 3rem; margin-bottom: 15px;">🔍</div>
                <h3 style="margin-bottom: 10px;">네이버에서 "${searchQuery}" 검색</h3>
                <p style="color: #666; margin-bottom: 20px;">
                    더 많은 맛집 정보를 네이버에서 확인해보세요!
                </p>
                <a href="${naverSearchUrl}" 
                   target="_blank" 
                   class="naver-search-btn"
                   style="display: inline-block;
                          background: linear-gradient(135deg, #03C75A 0%, #02B350 100%);
                          color: white;
                          padding: 15px 40px;
                          border-radius: 30px;
                          text-decoration: none;
                          font-weight: bold;
                          font-size: 1.1rem;
                          box-shadow: 0 4px 15px rgba(3, 199, 90, 0.3);
                          transition: transform 0.2s, box-shadow 0.2s;">
                    🔗 네이버 검색으로 이동
                </a>
            </div>
        `;
        return;
    }
    
    // 네이버 검색 URL 생성
    let searchQuery = `${state.location} 맛집`;
    if (state.menu) {
        searchQuery += ` ${state.menu}`;
    }
    const encodedQuery = encodeURIComponent(searchQuery);
    const naverSearchUrl = `https://search.naver.com/search.naver?query=${encodedQuery}&where=nexearch&sm=tab_hty.top`;
    
    let html = `
        <div style="margin-bottom: 20px; color: #667eea; font-weight: bold; font-size: 1.2rem;">
            📍 ${state.location} | 👥 ${state.peopleCount}명 ${state.menu ? `| 🍽️ ${state.menu}` : ''}
        </div>
    `;
    
    recommendations.forEach((restaurant, index) => {
        const note = restaurant.note || '';
        html += `
            <div class="result-card">
                <h3>${index + 1}. ${restaurant.name} ${note}</h3>
                <p>⭐ 평점: ${restaurant.rating}</p>
                <div class="details">
                    <div class="detail-item">
                        <span>수용 인원</span>
                        <strong>${restaurant.capacity}명</strong>
                    </div>
                    <div class="detail-item">
                        <span>1인당 가격</span>
                        <strong>${restaurant.price}</strong>
                    </div>
                    <div class="detail-item">
                        <span>추천도</span>
                        <strong>${Math.round(restaurant.rating / 5 * 100)}%</strong>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `
        <div style="margin-top: 20px; text-align: center;">
            <a href="${naverSearchUrl}" 
               target="_blank" 
               style="display: inline-block;
                      background: linear-gradient(135deg, #03C75A 0%, #02B350 100%);
                      color: white;
                      padding: 12px 30px;
                      border-radius: 25px;
                      text-decoration: none;
                      font-weight: bold;
                      font-size: 1rem;
                      box-shadow: 0 4px 15px rgba(3, 199, 90, 0.3);
                      transition: transform 0.2s, box-shadow 0.2s;">
                🔗 더 많은 맛집 보기 (네이버 검색)
            </a>
        </div>
        <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border-radius: 10px; color: #555;">
            💡 ${recommendations.length}개의 추천 식당을 찾았습니다! 네이버 검색에서 별점순으로 정렬된 더 많은 맛집을 확인해보세요.
        </div>
    `;
    
    resultDiv.innerHTML = html;
}

// 사람 아이콘 애니메이션 업데이트 함수
function updatePeopleAnimation(count) {
    const animationContainer = document.getElementById('people-animation');
    if (!animationContainer) return;
    
    // 현재 표시된 사람 아이콘 수 확인
    const currentIcons = animationContainer.querySelectorAll('.person-icon').length;
    
    // 인원 수에 따라 아이콘 추가 또는 제거
    if (count > currentIcons) {
        // 인원이 늘어나면 아이콘 추가
        for (let i = currentIcons; i < count; i++) {
            addPersonIcon(animationContainer, i);
        }
    } else if (count < currentIcons) {
        // 인원이 줄어들면 아이콘 제거
        const icons = animationContainer.querySelectorAll('.person-icon');
        for (let i = currentIcons - 1; i >= count; i--) {
            if (icons[i]) {
                icons[i].remove();
            }
        }
    }
}

// 사람 아이콘 추가 함수
function addPersonIcon(container, index) {
    const personIcon = document.createElement('div');
    personIcon.className = 'person-icon';
    personIcon.innerHTML = '🧑';
    personIcon.style.animationDelay = `${index * 0.1}s`;
    container.appendChild(personIcon);
}
