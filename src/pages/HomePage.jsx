import React, { useState } from 'react';
import { Search, HelpCircle, Plus, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

// --- Mock Data ---
const mockSavedBoards = [
  {
    id: '1',
    title: 'Q3 Brainstorming Session',
    description: 'Ideas for the next quarter.',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=169&fit=crop',
    updatedAt: '2025-07-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'New Feature UI/UX',
    description: 'Wireframes and user flow diagrams.',
    thumbnail: null, // Will use gradient fallback
    updatedAt: '2025-07-16T14:30:00Z',
  },
  {
    id: '3',
    title: 'Marketing Campaign Plan',
    description: 'Strategy for the upcoming product launch.',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=169&fit=crop',
    updatedAt: '2025-07-17T09:00:00Z',
  },
];

const mockSharedBoards = [
  {
    id: '4',
    title: 'Shared Project Alpha',
    description: 'Project timeline and deliverables shared by team.',
    thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=300&h=169&fit=crop',
    updatedAt: '2025-07-14T11:00:00Z',
  },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [boardSearchQuery, setBoardSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('saved');
  
  // State is now initialized with mock data instead of being fetched
  const [boards, setBoards] = useState(mockSavedBoards);
  const [sharedBoards, setSharedBoards] = useState(mockSharedBoards);

  // Handle board click (for navigation simulation)
  const handleBoardClick = (boardId) => {
    // In a real app, this would navigate to the board editor
    console.log(`Navigating to board with ID: ${boardId}`);
    // window.location.href = `/board/${boardId}`;
  };

  // Filter boards based on search query
  const getFilteredBoards = () => {
    const currentBoards = activeTab === 'saved' ? boards : sharedBoards;
    return currentBoards.filter(board =>
      board.title.toLowerCase().includes(boardSearchQuery.toLowerCase()) ||
      (board.description && board.description.toLowerCase().includes(boardSearchQuery.toLowerCase()))
    );
  };

  const TriangleIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
      <path
        d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"
        fill="currentColor"
      />
    </svg>
  );

  // BoardCard component simplified to remove delete functionality
  const BoardCard = ({ board }) => (
    <div className="flex flex-col gap-3 pb-3 cursor-pointer group relative">
      <div
        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl transition-transform group-hover:scale-105 group-hover:shadow-lg"
        style={{ 
          backgroundImage: board.thumbnail 
            ? `url("${board.thumbnail}")` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
        onClick={() => handleBoardClick(board.id)}
      >
        {/* Overlay with board info */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-200 flex items-end p-3">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-white text-xs">
              {board.updatedAt ? `Updated ${new Date(board.updatedAt).toLocaleDateString()}` : 'New board'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-start">
        <div className="flex-1" onClick={() => handleBoardClick(board.id)}>
          <p className="text-white text-base font-medium leading-normal group-hover:text-blue-300 transition-colors">
            {board.title}
          </p>
          {board.description && (
            <p className="text-slate-400 text-sm mt-1 truncate">
              {board.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const filteredBoards = getFilteredBoards();

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-900 dark group/design-root overflow-x-hidden font-sans">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-700 px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-white">
              <TriangleIcon />
              <h2 className="text-white text-lg font-bold leading-tight tracking-wide">LUMO</h2>
            </div>
            <nav className="flex items-center gap-9">
              <a className="text-white text-sm font-medium leading-normal hover:text-blue-300 transition-colors" href="/dashboard">
                Home
              </a>
              <a className="text-white text-sm font-medium leading-normal hover:text-blue-300 transition-colors" href="/templates">
                Templates
              </a>
              <a className="text-white text-sm font-medium leading-normal hover:text-blue-300 transition-colors" href="/inspiration">
                Inspiration
              </a>
              <a className="text-white text-sm font-medium leading-normal hover:text-blue-300 transition-colors" href="/pricing">
                Pricing
              </a>
            </nav>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            {/* Header Search */}
            <div className="flex flex-col min-w-40 h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div className="text-slate-400 flex border-none bg-slate-700 items-center justify-center pl-4 rounded-l-xl border-r-0">
                  <Search size={24} />
                </div>
                <input
                  placeholder="Search"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-slate-700 focus:border-none h-full placeholder:text-slate-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-slate-700 text-white gap-2 text-sm font-bold leading-normal tracking-wide min-w-0 px-2.5 hover:bg-slate-600 transition-colors">
              <HelpCircle size={20} />
            </button>
            
            {/* User Profile Removed */}
          </div>
        </header>

        {/* Main Content */}
        <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Page Header */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-tight text-3xl font-bold leading-tight min-w-72">
                Your boards
              </p>
              <button 
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-slate-700 text-white text-sm font-medium leading-normal hover:bg-slate-600 transition-colors"
              >
                <Plus size={16} className="mr-1" />
                <span className="truncate">
                  New board
                </span>
              </button>
            </div>

            {/* Board Search */}
            <div className="px-4 py-3">
              <div className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div className="text-slate-400 flex border-none bg-slate-700 items-center justify-center pl-4 rounded-l-xl border-r-0">
                    <Search size={24} />
                  </div>
                  <input
                    placeholder="Search boards"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-slate-700 focus:border-none h-full placeholder:text-slate-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    value={boardSearchQuery}
                    onChange={(e) => setBoardSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="pb-3">
              <div className="flex border-b border-slate-600 px-4 gap-8">
                <button
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
                    activeTab === 'saved' 
                      ? 'border-b-blue-500 text-white' 
                      : 'border-b-transparent text-slate-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('saved')}
                >
                  <p className="text-sm font-bold leading-normal tracking-wide">
                    Saved boards ({boards.length})
                  </p>
                </button>
                <button
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
                    activeTab === 'shared' 
                      ? 'border-b-blue-500 text-white' 
                      : 'border-b-transparent text-slate-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('shared')}
                >
                  <p className="text-sm font-bold leading-normal tracking-wide">
                    Shared boards ({sharedBoards.length})
                  </p>
                </button>
              </div>
            </div>

            {/* Board Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-4">
              {filteredBoards.map((board) => (
                <BoardCard 
                  key={board.id} 
                  board={board} 
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredBoards.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-slate-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-lg mb-2">
                  {boardSearchQuery ? 'No boards found' : 'No boards yet'}
                </p>
                <p className="text-slate-500 text-sm mb-4">
                  {boardSearchQuery 
                    ? 'Try adjusting your search or create a new board' 
                    : 'Create your first board to get started'}
                </p>
                {!boardSearchQuery && (
                  <button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                    Create your first board
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;