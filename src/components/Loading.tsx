
const Loading = () => {
  return (
    <>
     <div className="min-h-screen flex items-center justify-center bg-white/30 backdrop-blur-sm">
      <div className="relative">
        <div className="w-24 h-24 border border-white rounded-full animate-spin" style={{animationDuration : '2s'}} >
          <div className="absolute inset-0 border-3 border-transparent border-y-cyan-600 border-l-cyan-600 rounded-full animate-spin" style={{animationDuration : '2s'}} ></div>
        </div>
      </div>
    </div>


    </>
  )
}

export default Loading
