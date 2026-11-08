export default function ImageComponent({
  src,
  altText,
}: {
  src: string
  altText: string
}) {
  return (
    <img
      src={src}
      alt={altText}
      className="my-4 h-auto max-w-full rounded-sm border border-border"
    />
  )
}
