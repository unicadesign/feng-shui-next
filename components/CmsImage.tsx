import React from 'react';
import { parseImageUrl } from '@/lib/imagePosition';

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | null | undefined;
};

export default function CmsImage({ src, style, ...rest }: Props) {
  const parsed = parseImageUrl(src);
  const merged = parsed.position
    ? { ...style, objectPosition: parsed.position }
    : style;
  return <img {...rest} src={parsed.src} style={merged} />;
}
