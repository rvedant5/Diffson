import React, { useState, useRef, useEffect } from 'react';
import { Upload, Search, ChevronDown, ChevronRight, Download, Copy, RefreshCw, X, FileJson } from 'lucide-react';
import _ from 'lodash';

const App = () => {
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');
  const [parsed1, setParsed1] = useState(null);
  const [parsed2, setParsed2] = useState(null);
  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');
  const [viewMode, setViewMode] = useState('tree');
  const [diffMode, setDiffMode] = useState('key+data');
  const [sortedJson1, setSortedJson1] = useState(false);
  const [sortedJson2, setSortedJson2] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandAll, setExpandAll] = useState(true);
  const [copySuccess1, setCopySuccess1] = useState(false);
  const [copySuccess2, setCopySuccess2] = useState(false);
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);

  const parseJSON = (text, setError, setParsed) => {
    if (!text.trim()) {
      setError('');
      setParsed(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      setParsed(parsed);
      setError('');
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
      setParsed(null);
    }
  };

  useEffect(() => {
    parseJSON(json1, setError1, setParsed1);
  }, [json1]);

  useEffect(() => {
    parseJSON(json2, setError2, setParsed2);
  }, [json2]);

  const sortObjectKeys = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(item => sortObjectKeys(item));
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((sorted, key) => {
          sorted[key] = sortObjectKeys(obj[key]);
          return sorted;
        }, {});
    }
    return obj;
  };

  const handleSort = (side) => {
    if (side === 1 && parsed1) {
      const sorted = sortObjectKeys(parsed1);
      setJson1(JSON.stringify(sorted, null, 2));
      setSortedJson1(!sortedJson1);
    } else if (side === 2 && parsed2) {
      const sorted = sortObjectKeys(parsed2);
      setJson2(JSON.stringify(sorted, null, 2));
      setSortedJson2(!sortedJson2);
    }
  };

  const handleFileUpload = (e, setJson) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setJson(event.target.result);
      reader.readAsText(file);
    }
  };

  const swapPanels = () => {
    const temp = json1;
    setJson1(json2);
    setJson2(temp);
  };

  const copyToClipboard = (text, side) => {
    navigator.clipboard.writeText(text).then(() => {
      if (side === 1) {
        setCopySuccess1(true);
        setTimeout(() => setCopySuccess1(false), 2000);
      } else {
        setCopySuccess2(true);
        setTimeout(() => setCopySuccess2(false), 2000);
      }
    });
  };

  const downloadJSON = (text, filename) => {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const flattenObject = (obj, prefix = '') => {
    const flattened = [];
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattened.push(...flattenObject(obj[key], fullKey));
      } else {
        flattened.push({ key: fullKey, value: JSON.stringify(obj[key]) });
      }
    }
    return flattened;
  };

  const getAllKeys = (obj1, obj2) => {
    const keys = new Set();
    const addKeys = (obj, prefix = '') => {
      if (!obj) return;
      for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        keys.add(fullKey);
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          addKeys(obj[key], fullKey);
        }
      }
    };
    addKeys(obj1);
    addKeys(obj2);
    return Array.from(keys).sort();
  };

  const getValueAtPath = (obj, path) => {
    if (!obj) return undefined;
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      current = current[part];
    }
    return current;
  };

  const getDiffStatus = (key, val1, val2) => {
    const exists1 = val1 !== undefined;
    const exists2 = val2 !== undefined;
    
    if (!exists1 && exists2) return 'missing-left';
    if (exists1 && !exists2) return 'missing-right';
    if (JSON.stringify(val1) !== JSON.stringify(val2)) return 'different';
    return 'same';
  };

  const TreeNode = ({ data, path = '', side, isExpanded }) => {
    const [expanded, setExpanded] = useState(isExpanded);
    
    useEffect(() => {
      setExpanded(isExpanded);
    }, [isExpanded]);

    if (data === null || data === undefined) {
      return <span className="text-gray-500">null</span>;
    }

    if (typeof data !== 'object' || Array.isArray(data)) {
      const str = JSON.stringify(data);
      const highlight = searchTerm && str.toLowerCase().includes(searchTerm.toLowerCase());
      return <span className={highlight ? 'bg-yellow-200 px-1' : ''}>{str}</span>;
    }

    return (
      <div className="ml-4">
        {Object.entries(data).map(([key, value]) => {
          const fullPath = path ? `${path}.${key}` : key;
          const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
          const highlight = searchTerm && key.toLowerCase().includes(searchTerm.toLowerCase());
          
          let diffClass = '';
          if (diffMode !== 'none' && parsed1 && parsed2) {
            const val1 = getValueAtPath(parsed1, fullPath);
            const val2 = getValueAtPath(parsed2, fullPath);
            const status = getDiffStatus(fullPath, val1, val2);
            
            if (diffMode === 'key' || diffMode === 'key+data') {
              if (side === 1 && status === 'missing-right') diffClass = 'bg-red-100 border-l-4 border-red-500 pl-2';
              if (side === 2 && status === 'missing-left') diffClass = 'bg-red-100 border-l-4 border-red-500 pl-2';
            }
            if (diffMode === 'data' || diffMode === 'key+data') {
              if (status === 'different') diffClass = 'bg-yellow-100 border-l-4 border-yellow-500 pl-2';
            }
            if (status === 'same') diffClass = 'bg-green-50';
          }

          return (
            <div key={key} className={`my-1 rounded ${diffClass} ${highlight ? 'bg-blue-200' : ''}`}>
              <div className="flex items-center py-1">
                {isObject && (
                  <button onClick={() => setExpanded(!expanded)} className="mr-1 hover:bg-gray-200 rounded p-1">
                    {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}
                {!isObject && <span className="w-6"></span>}
                <span className="font-semibold text-blue-700">{key}:</span>
                {!isObject && (
                  <span className="ml-2 text-gray-700">
                    <TreeNode data={value} path={fullPath} side={side} isExpanded={isExpanded} />
                  </span>
                )}
              </div>
              {isObject && expanded && (
                <TreeNode data={value} path={fullPath} side={side} isExpanded={isExpanded} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const ListView = ({ data, side }) => {
    const flattened = flattenObject(data);
    return (
      <div className="space-y-1">
        {flattened.map(({ key, value }, index) => {
          const highlight = searchTerm && (key.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                          value.toLowerCase().includes(searchTerm.toLowerCase()));
          
          let diffClass = '';
          if (diffMode !== 'none' && parsed1 && parsed2) {
            const val1 = getValueAtPath(parsed1, key);
            const val2 = getValueAtPath(parsed2, key);
            const status = getDiffStatus(key, val1, val2);
            
            if (diffMode === 'key' || diffMode === 'key+data') {
              if (side === 1 && status === 'missing-right') diffClass = 'bg-red-100 border-l-4 border-red-500';
              if (side === 2 && status === 'missing-left') diffClass = 'bg-red-100 border-l-4 border-red-500';
            }
            if (diffMode === 'data' || diffMode === 'key+data') {
              if (status === 'different') diffClass = 'bg-yellow-100 border-l-4 border-yellow-500';
            }
            if (status === 'same') diffClass = 'bg-green-50';
          }

          return (
            <div key={`${key}-${index}`} className={`p-3 border-b hover:bg-gray-50 ${diffClass} ${highlight ? 'bg-blue-100' : ''}`}>
              <div className="font-semibold text-sm text-blue-700 font-mono">{key}</div>
              <div className="text-sm text-gray-700 mt-1 break-all">{value}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const TableView = () => {
    const allKeys = getAllKeys(parsed1, parsed2);
    
    return (
      <div className="overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0">
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-600 p-3 text-left font-semibold">Key</th>
              <th className="border border-gray-600 p-3 text-left font-semibold">JSON 1</th>
              <th className="border border-gray-600 p-3 text-left font-semibold">JSON 2</th>
              <th className="border border-gray-600 p-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {allKeys.map((key, index) => {
              const val1 = getValueAtPath(parsed1, key);
              const val2 = getValueAtPath(parsed2, key);
              const status = getDiffStatus(key, val1, val2);
              const highlight = searchTerm && key.toLowerCase().includes(searchTerm.toLowerCase());
              
              let bgClass = '';
              let statusColor = '';
              let statusText = '';
              
              if (diffMode === 'key' || diffMode === 'key+data') {
                if (status === 'missing-left') {
                  bgClass = 'bg-red-50';
                  statusColor = 'text-red-700 font-semibold';
                  statusText = '⚠ Missing in JSON1';
                }
                if (status === 'missing-right') {
                  bgClass = 'bg-red-50';
                  statusColor = 'text-red-700 font-semibold';
                  statusText = '⚠ Missing in JSON2';
                }
              }
              if (diffMode === 'data' || diffMode === 'key+data') {
                if (status === 'different') {
                  bgClass = 'bg-yellow-50';
                  statusColor = 'text-yellow-700 font-semibold';
                  statusText = '⚡ Different Values';
                }
              }
              if (status === 'same') {
                bgClass = 'bg-green-50';
                statusColor = 'text-green-700';
                statusText = '✓ Match';
              }
              
              return (
                <tr key={`${key}-${index}`} className={`${bgClass} ${highlight ? 'bg-blue-100' : ''} hover:bg-opacity-80`}>
                  <td className="border border-gray-300 p-3 font-mono text-xs break-all">{key}</td>
                  <td className="border border-gray-300 p-3 font-mono text-xs break-all">{val1 !== undefined ? JSON.stringify(val1) : <span className="text-gray-400">-</span>}</td>
                  <td className="border border-gray-300 p-3 font-mono text-xs break-all">{val2 !== undefined ? JSON.stringify(val2) : <span className="text-gray-400">-</span>}</td>
                  <td className={`border border-gray-300 p-3 text-xs ${statusColor}`}>
                    {statusText}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <header className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FileJson size={48} className="text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Diffson
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Parse, compare, and visualize JSON files with ease</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 border border-gray-200">
          <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('tree')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'tree' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tree View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'table' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Table View
              </button>
            </div>

            <select
              value={diffMode}
              onChange={(e) => setDiffMode(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="key">Key Difference</option>
              <option value="data">Data Difference</option>
              <option value="key+data">Key + Data</option>
            </select>

            <button
              onClick={swapPanels}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-purple-700 transition-all shadow-md"
            >
              <RefreshCw size={16} /> Swap
            </button>

            {viewMode === 'tree' && (
              <button
                onClick={() => setExpandAll(!expandAll)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
              >
                {expandAll ? 'Collapse All' : 'Expand All'}
              </button>
            )}

            <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border-2 border-gray-200 focus-within:border-blue-500">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search keys/values..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
            {parsed1 && parsed2 ? (
              <TableView />
            ) : (
              <div className="text-center text-gray-500 py-12">
                <FileJson size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Upload or paste JSON in both panels to view comparison table</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map((side) => {
              const json = side === 1 ? json1 : json2;
              const setJson = side === 1 ? setJson1 : setJson2;
              const parsed = side === 1 ? parsed1 : parsed2;
              const error = side === 1 ? error1 : error2;
              const copySuccess = side === 1 ? copySuccess1 : copySuccess2;

              return (
                <div key={side} className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">JSON {side}</h2>
                    <div className="flex gap-2">
                      <label className="cursor-pointer px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-blue-700 transition-all shadow-md">
                        <Upload size={16} /> Upload
                        <input
                          type="file"
                          accept=".json"
                          onChange={(e) => handleFileUpload(e, setJson)}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={() => handleSort(side)}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all shadow-md"
                        disabled={!parsed}
                      >
                        Sort Keys
                      </button>
                      <button
                        onClick={() => copyToClipboard(json, side)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-md ${
                          copySuccess 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                        disabled={!json}
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => downloadJSON(json, `json${side}.json`)}
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-all shadow-md"
                        disabled={!json}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={json}
                    onChange={(e) => setJson(e.target.value)}
                    placeholder="Paste JSON here or upload a file..."
                    className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm mb-3 focus:outline-none focus:border-blue-500 resize-none"
                  />

                  {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-3 text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 overflow-auto max-h-96" ref={side === 1 ? scrollRef1 : scrollRef2}>
                    {parsed ? (
                      viewMode === 'tree' ? (
                        <TreeNode data={parsed} side={side} isExpanded={expandAll} />
                      ) : (
                        <ListView data={parsed} side={side} />
                      )
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        <FileJson size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No valid JSON to display</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
          <h3 className="font-bold text-lg mb-3 text-gray-800">Color Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 border-2 border-red-500 rounded"></div>
              <span className="font-medium">Missing Key</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
              <span className="font-medium">Value Mismatch</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-50 border-2 border-green-500 rounded"></div>
              <span className="font-medium">Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 border-2 border-blue-500 rounded"></div>
              <span className="font-medium">Search Highlight</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
