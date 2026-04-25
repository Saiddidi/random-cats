// تحديد العناصر من DOM
const catImage = document.getElementById('catimg');
const nextBtn = document.getElementById('next-btn');
const downloadBtn = document.getElementById('download-btn');

// متغير لتخزين الرابط المحلي للصورة الحالية
// نحتاجه لكي نستخدمه في عملية العرض وعملية التحميل، ولتحرير الذاكرة لاحقاً
let currentObjectUrl = null;

/**
 * دالة مسؤولة عن جلب صورة جديدة من الخادم
 * تم فصلها في دالة مستقلة لسهولة إعادة استخدامها عند تحميل الصفحة أو عند الضغط على الزر
 */
async function fetchNewCatImage() {
    // تقليل الشفافية لإعطاء المستخدم إيحاء بأن هناك عملية تحميل جارية
    catImage.style.opacity = '0.5';
    
    // تعطيل الأزرار أثناء التحميل لمنع المستخدم من إرسال طلبات متعددة في نفس الوقت
    nextBtn.disabled = true;
    downloadBtn.disabled = true;

    try {
        // 1. طلب الصورة من الخادم باستخدام fetch بدلاً من وضع الرابط مباشرة في img.src
        const response = await fetch(`https://cataas.com/cat?t=${new Date().getTime()}`);
        
        // التحقق من نجاح الطلب
        if (!response.ok) throw new Error('فشل الاتصال بالخادم');

        // 2. تحويل الرد إلى بيانات خام (Blob - Binary Large Object)
        const blob = await response.blob();
        
        // 3. إدارة الذاكرة: إذا كان هناك رابط محلي سابق، قم بحذفه لمنع تسرب الذاكرة (Memory Leak)
        if (currentObjectUrl) {
            URL.revokeObjectURL(currentObjectUrl);
        }
        
        // 4. إنشاء رابط محلي جديد يشير إلى البيانات الخام الموجودة في ذاكرة المتصفح
        currentObjectUrl = URL.createObjectURL(blob);
        
        // 5. عرض الصورة باستخدام الرابط المحلي
        catImage.src = currentObjectUrl;
        
    } catch (error) {
        console.error("حدث خطأ أثناء جلب الصورة:", error);
        alert("تعذر جلب صورة جديدة، يرجى المحاولة لاحقاً.");
    } finally {
        // إعادة الشفافية وتفعيل الأزرار سواء نجحت العملية أو فشلت
        catImage.style.opacity = '1';
        nextBtn.disabled = false;
        downloadBtn.disabled = false;
    }
}

// تنفيذ عملية جلب الصورة الجديدة عند الضغط على الزر
nextBtn.addEventListener('click', fetchNewCatImage);

// تنفيذ عملية جلب صورة فور تحميل الصفحة لضمان أن الصورة الأولى قابلة للتحميل بشكل صحيح
document.addEventListener('DOMContentLoaded', fetchNewCatImage);

// منطق تحميل الصورة
downloadBtn.addEventListener('click', () => {
    // التحقق من وجود صورة جاهزة للتحميل
    if (!currentObjectUrl) return;

    try {
        // لا نحتاج لعمل fetch مرة أخرى! لدينا البيانات بالفعل على شكل رابط محلي
        const a = document.createElement('a');
        a.style.display = 'none';
        
        // نستخدم الرابط المحلي الذي قمنا بإنشائه مسبقاً
        a.href = currentObjectUrl;
        a.download = `cat_${new Date().getTime()}.jpg`;
        
        document.body.appendChild(a);
        a.click();
        
        // ملاحظة: لا نستخدم URL.revokeObjectURL هنا لأن الرابط لا يزال يُستخدم لعرض الصورة الحالية
        document.body.removeChild(a);
        
    } catch (error) {
        alert("عذراً، حدث خطأ أثناء محاولة تحميل الصورة.");
        console.error("Download Error:", error);
    }
});
