import React, { useState } from 'react';
import { HardDrive, RefreshCw, Search, X, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { motion, AnimatePresence } from 'motion/react';
import { PlaylistModal } from '../modals/PlaylistModal';
import { Playlist } from '../../types';

export function MusicView() {
  const { 
    sdSongs, 
    playlists, 
    currentTrackIndex, 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    currentTime, 
    isSystemOnline, 
    playTrack,
    triggerCommand,
    playPlaylist
  } = useAudio();

  const [musicTab, setMusicTab] = useState<'songs' | 'playlists'>('songs');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const filteredSongs = sdSongs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const progressPercent = Math.min(100, (currentTime / (currentTrack?.durationSec || 1)) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* DEVICE LIBRARY STATUS CARD */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                  Device Library • SD Card
                </h2>
                <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md border border-neutral-200">
                  FAT32 • 32GB
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs mt-1">
                <span className="font-semibold text-neutral-700">{sdSongs.length} Songs Available</span>
                <span className="text-neutral-300">•</span>
                {isSystemOnline ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    SD Card Mounted
                  </span>
                ) : (
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Device Offline
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button 
              onClick={() => triggerCommand("GET /api/device/songs", "SD Card Rescanned")}
              className="text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
              <span>Rescan SD</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TABS */}
      <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMusicTab('songs')}
            className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-2xl transition-all ${
              musicTab === 'songs' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/60'
            }`}
          >
            Available Songs ({sdSongs.length})
          </button>
          
          <button 
            onClick={() => setMusicTab('playlists')}
            className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-2xl transition-all ${
              musicTab === 'playlists' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/60'
            }`}
          >
            Playlists ({playlists.length})
          </button>
        </div>
        <div className="text-[11px] text-neutral-400 hidden sm:block">
          DFPlayer UART protocol
        </div>
      </div>

      {/* AVAILABLE SONGS */}
      <AnimatePresence mode="wait">
        {musicTab === 'songs' && (
          <motion.div 
            key="songs"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search songs on SD card..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-neutral-200 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Song List */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm divide-y divide-neutral-100 overflow-hidden">
              {filteredSongs.length > 0 ? (
                filteredSongs.map((song) => {
                  const originalIndex = sdSongs.findIndex(s => s.id === song.id);
                  const isCurrent = originalIndex === currentTrackIndex;

                  return (
                    <div 
                      key={song.id}
                      onClick={() => playTrack(originalIndex)}
                      className={`flex items-center gap-3.5 p-3.5 sm:p-4 transition cursor-pointer select-none ${
                        isCurrent ? 'bg-orange-50/80' : 'hover:bg-neutral-50 active:bg-neutral-100'
                      }`}
                    >
                      <div className="w-8 text-center shrink-0">
                        {isCurrent && isPlaying ? (
                          <div className="flex items-end justify-center gap-0.5 h-4">
                            <div className="w-1 bg-orange-600 rounded-full eq-bar-1"></div>
                            <div className="w-1 bg-orange-600 rounded-full eq-bar-2"></div>
                            <div className="w-1 bg-orange-600 rounded-full eq-bar-3"></div>
                          </div>
                        ) : (
                          <span className={`text-xs font-mono font-bold ${isCurrent ? 'text-orange-600' : 'text-neutral-400'}`}>
                            #{String(song.id).padStart(2, '0')}
                          </span>
                        )}
                      </div>

                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                        isCurrent ? 'bg-orange-500 text-white shadow-sm' : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {song.artwork}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-orange-950 font-bold' : 'text-neutral-900'}`}>
                            {song.title}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] bg-orange-200/60 text-orange-800 font-bold px-1.5 py-0.2 rounded">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 truncate mt-0.5">
                          {song.artist} • <span className="text-neutral-400">{song.category}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-mono text-neutral-400 font-medium">
                          {song.duration}
                        </span>
                        <button 
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                            isCurrent 
                              ? 'bg-orange-600 text-white shadow-sm' 
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {isCurrent && isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                sdSongs.length === 0 ? (
                  <div className="p-10 text-center text-neutral-500">
                    <RefreshCw className="w-8 h-8 mx-auto text-orange-500 mb-3 animate-spin" />
                    <p className="text-sm font-semibold text-neutral-700">Waiting for music library...</p>
                    <p className="text-xs text-neutral-400 mt-0.5">Connecting to Pico SD Card mapping feed.</p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-neutral-500">
                    <Search className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                    <p className="text-sm font-semibold text-neutral-700">No songs found</p>
                    <p className="text-xs">Try another search term.</p>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}

        {/* PLAYLISTS */}
        {musicTab === 'playlists' && (
          <motion.div 
            key="playlists"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
          >
            {playlists.map((pl) => (
              <div 
                key={pl.id}
                onClick={() => setSelectedPlaylist(pl)}
                className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm flex flex-col justify-between hover:border-orange-200 transition cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl shrink-0">
                      {pl.icon}
                    </div>
                    <span className="text-xs font-mono font-semibold bg-orange-50 text-orange-800 px-2.5 py-1 rounded-full border border-orange-200/50">
                      {pl.badge}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-base text-neutral-900 mt-3">{pl.name}</h3>
                  <p className="text-xs text-neutral-500 mt-1">{pl.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">Sequential loop enabled</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      playPlaylist(pl.name);
                    }}
                    className="text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Group</span>
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPlaylist && (
          <PlaylistModal 
            playlist={selectedPlaylist} 
            onClose={() => setSelectedPlaylist(null)} 
          />
        )}
      </AnimatePresence>

      {/* PERSISTENT MINI-PLAYER */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-[88px] left-0 right-0 z-20 px-2 sm:px-0 sm:max-w-md sm:mx-auto"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-orange-200/80 shadow-md p-3 pb-2.5">
              <div className="relative h-1 w-full bg-neutral-100 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs shrink-0 font-bold shadow-sm shadow-orange-500/20">
                    {currentTrack.artwork}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-neutral-900 truncate">
                      {currentTrack.title}
                    </h5>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {currentTrack.artist} • <span className="font-mono">{formatTime(currentTime)} / {currentTrack.duration}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    onClick={prevTrack}
                    className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition active:scale-95"
                  >
                    <SkipBack className="w-4 h-4 fill-current" />
                  </button>

                  <button 
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-sm transition active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button 
                    onClick={nextTrack}
                    className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition active:scale-95"
                  >
                    <SkipForward className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
