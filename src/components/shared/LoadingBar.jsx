export default function LoadingBar() {
  return (
    <div className="h-1.5 w-full bg-[#141414] overflow-hidden rounded-full">
      <div
        className="h-full bg-cta-steel animate-pulse"
        style={{ width: '40%' }}
      />
    </div>
  )
}
