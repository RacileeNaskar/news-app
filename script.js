// Function to fetch news and display them
function fetchAndDisplayNews() {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ftechcrunch.com%2Ffeed%2F')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayNews(data.items);
            displaySidebarNews(data.items);
        })
        .catch(error => {
            console.error('Error fetching the news:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Failed to fetch news. Please try again later.';
            document.getElementById('news-list').appendChild(errorMessage);
        });
}

// Function to display news items in the main content area
function displayNews(items) {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = ''; // Clear existing content

    items.forEach(item => {
        const li = document.createElement('li');
        const h2 = document.createElement('h2');
        const p = document.createElement('p');
        const a = document.createElement('a');
        const bookmarkBtn = document.createElement('button');

        h2.textContent = item.title;
        p.textContent = item.description;
        a.textContent = 'Read more..';
        a.href = item.link;
        a.target = '_blank';
        bookmarkBtn.textContent = 'Bookmark';
        bookmarkBtn.classList.add('bookmark-btn');
        bookmarkBtn.dataset.title = item.title;
        bookmarkBtn.dataset.link = item.link;

        li.appendChild(h2);
        li.appendChild(p);
        li.appendChild(a);
        li.appendChild(bookmarkBtn);

        newsList.appendChild(li);
    });
}

// Function to display news items in the sidebar
function displaySidebarNews(items) {
    const sidebarNewsList = document.getElementById('sidebar-news-list');
    sidebarNewsList.innerHTML = ''; // Clear existing content

    items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = item.title;
        a.href = item.link;
        a.target = '_blank';

        li.appendChild(a);
        sidebarNewsList.appendChild(li);
    });
}

// Function to display bookmarks
function displayBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const bookmarkList = document.getElementById('bookmark-list');
    bookmarkList.innerHTML = ''; // Clear existing content

    bookmarks.forEach(bookmark => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const removeBtn = document.createElement('button');

        a.textContent = bookmark.title;
        a.href = bookmark.link;
        a.target = '_blank';
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn');
        removeBtn.dataset.title = bookmark.title;

        li.appendChild(a);
        li.appendChild(removeBtn);
        bookmarkList.appendChild(li);
    });
}

// Event listener for bookmark button clicks
document.getElementById('news-list').addEventListener('click', function(event) {
    if (event.target.classList.contains('bookmark-btn')) {
        const title = event.target.dataset.title;
        const link = event.target.dataset.link;
        const bookmark = { title, link };
        addBookmark(bookmark);
    }
});

// Event listener for remove button clicks in the bookmarks section
document.getElementById('bookmark-list').addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-btn')) {
        const title = event.target.dataset.title;
        removeBookmark(title);
    }
});

// Function to add a bookmark
function addBookmark(bookmark) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    displayBookmarks(); // Refresh the bookmark list display
}

// Function to remove a bookmark
function removeBookmark(title) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks = bookmarks.filter(bookmark => bookmark.title !== title);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    displayBookmarks(); // Refresh the bookmark list display
}



// Initialize bookmarks on page load
document.addEventListener('DOMContentLoaded', displayBookmarks);

// Dark mode toggle functionality
const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
});

// Check for saved dark mode preference
const darkMode = localStorage.getItem('darkMode');
if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}




// Event listener for search form submission
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

    if (searchTerm === '') {
        fetchAndDisplayNews(); // If search is empty, display all news
        return;
    }

    fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ftechcrunch.com%2Ffeed%2F')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const filteredItems = data.items.filter(item => {
                return item.title.toLowerCase().includes(searchTerm) ||
                       item.description.toLowerCase().includes(searchTerm);
            });

            if (filteredItems.length === 0) {
                const noResultsMessage = document.createElement('p');
                noResultsMessage.textContent = 'No results found.';
                document.getElementById('news-list').innerHTML = '';
                document.getElementById('news-list').appendChild(noResultsMessage);
            } else {
                displayNews(filteredItems);
                displaySidebarNews(filteredItems);
            }
        })
        .catch(error => {
            console.error('Error fetching the news:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Failed to fetch news. Please try again later.';
            document.getElementById('news-list').appendChild(errorMessage);
        });
});

// Initial fetch and display of news when the page loads
fetchAndDisplayNews();
displayBookmarks(); // Display bookmarks when the page loads

