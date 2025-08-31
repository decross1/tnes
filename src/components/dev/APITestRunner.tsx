import React, { useState } from 'react';
import { testCharacterGeneration } from '../../services/testCharacterGeneration';
import { mockCharacterGeneration } from '../../services/testCharacterGenerationMock';

interface TestResults {
  claudeConfigured: boolean;
  imageConfigured: boolean;
  availableProviders: string[];
  preferredProvider: string;
}

export function APITestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const runTests = async () => {
    setIsRunning(true);
    setLogs([]);
    
    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    const capturedLogs: string[] = [];
    
    console.log = (...args) => {
      const message = args.join(' ');
      capturedLogs.push(message);
      setLogs(prev => [...prev, message]);
      originalLog(...args);
    };
    
    console.error = (...args) => {
      const message = '❌ ERROR: ' + args.join(' ');
      capturedLogs.push(message);
      setLogs(prev => [...prev, message]);
      originalError(...args);
    };
    
    try {
      const testResults = await testCharacterGeneration();
      setResults(testResults);
    } catch (error) {
      console.error('Test runner failed:', error);
    } finally {
      // Restore console
      console.log = originalLog;
      console.error = originalError;
      setIsRunning(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '400px',
      maxHeight: '80vh',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      overflow: 'auto',
      zIndex: 9999
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#FFD700' }}>🧪 API Test Runner</h3>
      
      <button 
        onClick={runTests}
        disabled={isRunning}
        style={{
          backgroundColor: isRunning ? '#666' : '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: isRunning ? 'not-allowed' : 'pointer',
          marginBottom: '8px',
          width: '100%'
        }}
      >
        {isRunning ? '🔄 Running Tests...' : '▶️ Run Character Generation Tests'}
      </button>
      
      <button 
        onClick={() => {
          setLogs([]);
          const originalLog = console.log;
          console.log = (...args) => {
            const message = args.join(' ');
            setLogs(prev => [...prev, message]);
            originalLog(...args);
          };
          mockCharacterGeneration();
          console.log = originalLog;
        }}
        style={{
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '15px',
          width: '100%'
        }}
      >
        🎭 Show Mock Prompts (No API calls)
      </button>
      
      {results && (
        <div style={{ 
          marginBottom: '15px', 
          padding: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px'
        }}>
          <div><strong>Status:</strong></div>
          <div>Claude: {results.claudeConfigured ? '✅' : '❌'}</div>
          <div>Image: {results.imageConfigured ? '✅' : '❌'}</div>
          <div>Provider: {results.preferredProvider}</div>
        </div>
      )}
      
      <div style={{ 
        maxHeight: '300px', 
        overflow: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: '10px',
        borderRadius: '4px'
      }}>
        {logs.length === 0 ? (
          <div style={{ color: '#888' }}>Click "Run Tests" to begin...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ 
              marginBottom: '2px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {log}
            </div>
          ))
        )}
      </div>
      
      <div style={{ 
        marginTop: '10px',
        fontSize: '10px',
        color: '#888',
        textAlign: 'center'
      }}>
        Check browser console for detailed logs
      </div>
    </div>
  );
}