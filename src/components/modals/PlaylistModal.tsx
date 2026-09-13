import { X, Play, Shuffle } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { motion } from 'motion/react';
import { Playlist, Song } from '../../types';

interface PlaylistModalProps {
  playlist: Playlist;
  onClose: () => void;
}

export function PlaylistModal({ playlist, onClose }: PlaylistModalProps) {
  const { sdSongs, playTrack, triggerCommand, currentTrack, isPlaying } = useAudio();

  // Create a simulated list of songs for this playlist
  // In a real app this would filter based on playlist mappings
  const playlistSongs = sdSongs.slice(0, playlist.count);

  const handlePlayAll = () => {
    triggerCommand(`POST /api/player/play {"playlist": "${playlist.id}"}`, `Playing ${playlist.name}`, () => {
      playTrack(0); // Simulate starting the first track
      onClose();
    });
  };

  const handleShuffle = () => {
    triggerCommand(`POST /api/player/shuffle {"playlist": "${playlist.id}"}`, `Shuffling ${playlist.name}`, () => {
      const randomIdx = Math.floor(Math.random() * playlistSongs.length);
      playTrack(randomIdx);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col max-h-[85vh]"
      >
        {/* Header Block */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 relative border-b border-orange-100">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/50 text-neutral-600 hover:bg-white transition backdrop-blur-sm">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center text-center mt-2">
            <div className="w-16 h-16 rounded-3xl bg-orange-500 text-white flex items-center justify-center text-3xl shadow-md shadow-orange-500/20 mb-4">
              {playlist.icon}
            </div>
            <h3 className="font-bold text-xl text-neutral-900 tracking-tight">{playlist.name}</h3>
            <p className="text-xs text-neutral-500 mt-1">{playlist.desc}</p>
            <div className="mt-3 flex gap-2">
              <span className="text-[10px] font-mono font-semibold bg-white text-orange-800 px-2.5 py-1 rounded-full border border-orange-200/50">
                {playlist.badge}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button 
              onClick={handlePlayAll}
              className="flex-1 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Play All
            </button>
            <button 
              onClick={handleShuffle}
              className="flex-1 py-3 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-sm shadow-sm active:scale-95 transition border border-neutral-200/60 flex items-center justify-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle
            </button>
          </div>
        </div>

        {/* List of Songs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {playlistSongs.map((song, idx) => {
            const isCurrent = currentTrack?.id === song.id;
            return (
              <div 
                key={song.id}
                onClick={() => {
                  playTrack(idx);
                  onClose();
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl transition cursor-pointer select-none border border-transparent ${
                  isCurrent ? 'bg-orange-50 border-orange-100' : 'hover:bg-neutral-50 active:bg-neutral-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                  isCurrent ? 'bg-orange-500 text-white shadow-sm' : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {song.artwork}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-orange-950 font-bold' : 'text-neutral-900'}`}>
                    {song.title}
                  </h4>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">
                    {song.artist}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <span className="text-[11px] font-mono text-neutral-400">{song.duration}</span>
                  {isCurrent && isPlaying ? (
                    <div className="flex items-end justify-center gap-0.5 h-3">
                      <div className="w-1 bg-orange-600 rounded-full eq-bar-1"></div>
                      <div className="w-1 bg-orange-600 rounded-full eq-bar-2"></div>
                      <div className="w-1 bg-orange-600 rounded-full eq-bar-3"></div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
