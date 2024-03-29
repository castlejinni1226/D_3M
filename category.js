// Add scrolling functionality
const containerDivs = document.querySelectorAll(".slider");
const nextDivs = document.querySelectorAll(".next");
const prevDivs = document.querySelectorAll(".prev");
let currentIndexs = [0, 0, 0];
for (let i = 0; i < containerDivs.length; i++) {
  nextDivs[i].addEventListener("click", () => {
    const container = containerDivs[i];
    if (currentIndexs[i] < container.children.length - 2) {
      currentIndexs[i] += 1;
      updateSlider(container, currentIndexs[i], 5);
    }
  });

  prevDivs[i].addEventListener("click", () => {
    const container = containerDivs[i];
    if (currentIndexs[i] > 0) {
      currentIndexs[i] -= 1;
      updateSlider(container, currentIndexs[i], 5);
    }
  });
}

// 슬라이더가 실행되도록 한다.
function updateSlider(container, currIndex, numSlides) {
  const slideWidth = container.children[0].offsetWidth * 4;
  const maxTranslateValue = slideWidth * (numSlides - 1);
  const newTranslateValue = -currIndex * slideWidth;

  if (Math.abs(newTranslateValue) < maxTranslateValue) {
    container.style.transform = `translateX(${newTranslateValue}px)`;
  } else {
    console.log("Sliding stopped!");
  }
}

function disableWheelClick() {
  const container = document.querySelector(".slider");

  //휠 클릭을 막습니다.
  container.addEventListener("mousedown", function (event) {
    if (event.button === 1) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

disableWheelClick();

// 탑 버튼 기능
let myButton = document.getElementById("btn-back-to-top");

window.onscroll = function () {
  ScrollFunction();
};

function ScrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    myButton.style.display = "block";
  } else {
    myButton.style.display = "none";
  }
}

myButton.addEventListener("click", function () {
  scrollToTop(800);
});

function scrollToTop(duration) {
  const start = window.pageYOffset;
  const startTime =
    "now" in window.performance ? performance.now() : new Date().getTime();

  function scroll() {
    const now =
      "now" in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, (now - startTime) / duration);

    window.scrollTo(0, Math.ceil((1 - time) * start));

    if (time < 1) {
      requestAnimationFrame(scroll);
    }
  }

  scroll();
}

document.getElementById("more-button").addEventListener("click", function () {
  showMoviesByCategory(
    "https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=ko-KR&region=KR&sort_by=popularity.desc&with_original_language=ko",
    "한국 인기 영화!",
    1
  );
});
document.getElementById("more-button2").addEventListener("click", function () {
  showMoviesByCategory(
    "https://api.themoviedb.org/3/movie/popular?language=ko-KR",
    "미국 인기 영화!",
    1
  );
});
document.getElementById("more-button3").addEventListener("click", function () {
  showMoviesByCategory(
    "https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=ko-KR&page=1&sort_by=revenue.desc",
    "역대 영화 인기 순위!",
    1
  );
});

function showMoviesByCategory(url, message, currentPage) {
  // 모든 섹션을 제거
  const sections = document.querySelectorAll("section");
  sections.forEach(section => {
    section.style.display = "none";
  });

  // "details" 섹션이 이미 존재한다면 제거
  const existingDetailsSection = document.getElementById("details");
  if (existingDetailsSection) {
    existingDetailsSection.remove();
  }
  const targetDiv = document.getElementById("topButton");

  // "details" 섹션을 생성
  const detailsSection = document.createElement("section");
  detailsSection.id = "details";
  detailsSection.className = "details";
  targetDiv.insertAdjacentElement("beforebegin", detailsSection);

  const titleBox = document.createElement("div");
  titleBox.className = "titleBox";
  detailsSection.appendChild(titleBox);

  const backButton = document.createElement("button");
  backButton.textContent = "메인으로";
  backButton.id = "back-to-main";
  backButton.type = "button";
  backButton.className = "btn-btn-dark";
  titleBox.appendChild(backButton);

  const detailsTitle = document.createElement("h1");
  detailsTitle.textContent = message;
  titleBox.appendChild(detailsTitle);

  const blankBox2 = document.createElement("div");
  blankBox2.style = "width : 110px";
  titleBox.appendChild(blankBox2);

  backButton.addEventListener("click", () => {
    detailsSection.style.display = "none";
    document.getElementById("details-main").remove();

    sections.forEach(section => {
      section.style.display = "block";
    });
  });

  const detailsMainSection = document.createElement("div");
  detailsMainSection.id = "details-main";
  detailsMainSection.className = "details-main";
  detailsSection.appendChild(detailsMainSection);

  // 영화 카테고리를 비동기로 가져옵니다.
  movieFetch(url, "details-main")
    .then(data => {
      addPagination(
        data.total_pages,
        message,
        detailsSection,
        url,
        currentPage
      );
    })
    .catch(err => console.error(err));
}

function addPagination(totalPages, message, container, url, currentPage) {
  const paginationContainer = document.createElement("nav");
  paginationContainer.setAttribute("aria-label", "Page navigation example");
  paginationContainer.style.display = "flex";
  paginationContainer.style.justifyContent = "center";

  const paginationList = document.createElement("ul");
  paginationList.className = "pagination";

  // 이전 버튼
  if (currentPage > 1) {
    const prevButton = document.createElement("li");
    prevButton.className = "page-item";
    const prevLink = document.createElement("a");
    prevLink.className = "page-link";
    prevLink.href = "#";
    prevLink.setAttribute("aria-label", "Previous");
    const prevSpan = document.createElement("span");
    prevSpan.setAttribute("aria-hidden", "true");
    prevSpan.textContent = "«";
    prevLink.appendChild(prevSpan);
    prevButton.appendChild(prevLink);
    paginationList.appendChild(prevButton);

    // 이전 버튼 클릭 이벤트 리스너 추가
    prevButton.addEventListener("click", () => {
      const existingDetailsSection = document.getElementById("details-main");
      existingDetailsSection.innerHTML = "";
      showMoviesByCategory(
        `${url}&page=${currentPage - 1}`,
        message,
        currentPage - 1
      );
    });
  }

  // 페이지 번호
  const maxVisiblePages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = "page-item";
    if (i === currentPage) {
      pageItem.classList.add("active");
    }
    const pageLink = document.createElement("a");
    pageLink.className = "page-link";
    pageLink.href = "#";
    pageLink.textContent = i;

    // 페이지를 클릭하면 해당 페이지의 영화 목록을 가져오도록
    pageLink.addEventListener("click", () => {
      const existingDetailsSection = document.getElementById("details-main");
      existingDetailsSection.innerHTML = "";
      showMoviesByCategory(`${url}&page=${i}`, message, i);
    });

    pageItem.appendChild(pageLink);
    paginationList.appendChild(pageItem);
  }

  // 다음 버튼
  if (currentPage < totalPages) {
    const nextButton = document.createElement("li");
    nextButton.className = "page-item";
    const nextLink = document.createElement("a");
    nextLink.className = "page-link";
    nextLink.href = "#";
    nextLink.setAttribute("aria-label", "Next");
    const nextSpan = document.createElement("span");
    nextSpan.setAttribute("aria-hidden", "true");
    nextSpan.textContent = "»";
    nextLink.appendChild(nextSpan);
    nextButton.appendChild(nextLink);
    paginationList.appendChild(nextButton);

    nextButton.addEventListener("click", () => {
      const existingDetailsSection = document.getElementById("details-main");
      existingDetailsSection.innerHTML = "";
      showMoviesByCategory(
        `${url}&page=${currentPage + 1}`,
        message,
        currentPage + 1
      );
    });
  }

  paginationContainer.appendChild(paginationList);
  container.appendChild(paginationContainer);
}
