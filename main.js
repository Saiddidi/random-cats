// Select DOM elements using their IDs
const catImage = document.getElementById('catimg');
const nextBtn = document.getElementById('next-btn');
const downloadBtn = document.getElementById('download-btn');

// Logic for fetching a new random image
nextBtn.addEventListener('click', () => {
    /* Add a timestamp (t=...) to the URL. 
       This prevents the browser from loading a cached version 
       and forces it to fetch a fresh random image from the server.
    */
    const newImageUrl = `https://cataas.com/cat?t=${new Date().getTime()}`;
    
    // Lower opacity to give visual feedback that a new image is loading
    catImage.style.opacity = '0.5';
    
    // Update the image source
    catImage.src = newImageUrl;
    
    // When the new image finishes loading, restore full opacity
    catImage.onload = () => {
        catImage.style.opacity = '1';
    };
});

// Logic for downloading the image
downloadBtn.addEventListener('click', async () => {
    try {
        /* Fetch the image data as a 'blob' (Binary Large Object).
           This is necessary because simply linking to the URL might just 
           open the image in a new tab instead of downloading it.
        */
        const response = await fetch(catImage.src);
        const blob = await response.blob();
        
        // Create a temporary local URL for the downloaded blob data
        const url = window.URL.createObjectURL(blob);
        
        // Create a hidden 'a' element to trigger the download programmatically
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        // Name the file using a unique timestamp
        a.download = `cat_${new Date().getTime()}.jpg`;
        
        // Append to body, trigger click, then remove immediately
        document.body.appendChild(a);
        a.click();
        
        /* Memory management: Revoke the temporary URL and remove the 
           hidden element to free up system resources.
        */
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        // Handle potential errors (e.g., network issues or CORS blocks)
        alert("عذراً، حدث خطأ أثناء محاولة تحميل الصورة.");
        console.error("Download Error:", error);
    }
});