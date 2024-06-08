const url = 'http://localhost:5500/api';

export const addPosts =async () => {
    const data = await fetch('https://api.quotable.io/quotes');
    const res = await data.json();
    console.log(res);
    
}