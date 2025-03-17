// app/exam/layout.jsx


export default function ExamLayout({ children }) {
  return (
    <div>
      
      <div className="mx-10 md:mx-20 lg:px-60 mt-10">
        {children}  {/* This will wrap page.jsx */}
      </div>
    </div>
  );
}
