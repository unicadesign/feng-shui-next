import React from 'react';
import { Play } from 'lucide-react';

interface VideoEmbedProps {
  videoUrl?: string;
  title: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ videoUrl, title }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-warm" style={{ paddingBottom: '56.25%' }}>
      {videoUrl ? (
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={videoUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 bg-navy-50 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-navy-100 flex items-center justify-center">
            <Play size={28} className="text-navy-500 ml-1" />
          </div>
          <p className="text-navy-500 font-heading font-medium text-lg">{title}</p>
          <p className="text-charcoal-400 text-sm font-body">Video uskoro dostupan</p>
        </div>
      )}
    </div>
  );
};

export default VideoEmbed;
