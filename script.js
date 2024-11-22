
async function createBlogPost(newPost) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/67404cfaacd3cb34a8acbc6d/latest`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2a$10$EzXLfm23nVvDZV3uew6zuOCLbTe13tXdio.wSUXdzCxipeW44GAb2',
                'Cache-Control': 'no-cache'
            }
        });

        const data = await response.json();
        console.log(data);
        let existingPosts = [];
        if (data && data.record && data.record.record && Array.isArray(data.record.record.blog)) {
            existingPosts = data.record.record.blog;
        } else {
            console.warn('Blog field missing or invalid:', data.record);
        }
        console.log('Existing Posts:', existingPosts);

        const updatedPosts = [...existingPosts, newPost];
        console.log('Updated Posts:', updatedPosts);

        const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/67404cfaacd3cb34a8acbc6d`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2a$10$EzXLfm23nVvDZV3uew6zuOCLbTe13tXdio.wSUXdzCxipeW44GAb2'
            },
            body: JSON.stringify({
                record: {
                    blog: updatedPosts
                }
            })
        });

        if (updateResponse.ok) {
            console.log('Blog post created successfully!');
        } else {
            console.error('Failed to update bin:', updateResponse.statusText);
        }
    } catch (error) {
        console.error('Error during createBlogPost:', error);
    }
}


async function fetchBlogPosts() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/67404cfaacd3cb34a8acbc6d/latest`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'X-Master-Key': '$2a$10$EzXLfm23nVvDZV3uew6zuOCLbTe13tXdio.wSUXdzCxipeW44GAb2',
                'Cache-Control': 'no-cache'
            }
        });

        const data = await response.json();
        console.log(data);
        let blogPosts = [];
        if (data && data.record && data.record.record && Array.isArray(data.record.record.blog)) {
            blogPosts = data.record.record.blog;
        } else {
            console.warn('Blog field missing or invalid:', data.record);
        }
        console.log(data);
        const outputElement = document.getElementById('output');
        outputElement.innerHTML = '';

        if (blogPosts.length > 0) {
            blogPosts.forEach(blog => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${blog.title}:</strong> ${blog.description}`;
                console.log('Appending:', listItem.innerHTML);
                outputElement.appendChild(listItem);
            });
        } else {
            outputElement.innerHTML = "<li>No blog posts available...</li>"
        }
        console.log(blogPosts);

        return blogPosts;
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

// Handling form submission
document.getElementById('post-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    const newBlog = { id: Date.now().toString(), title, description};

    await createBlogPost(newBlog);

    await fetchBlogPosts();

    e.target.reset();
})

document.getElementById('fetch-data').addEventListener('click', fetchBlogPosts);