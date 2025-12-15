class SREGPTDashboard {
    constructor() {
        this.socket = null;
        this.healthData = null;
        this.init();
    }

    init() {
        this.connectSocket();
        this.setupEventListeners();
        this.loadInitialData();
        this.loadRecentEvents();
    }

    connectSocket() {
        try {
            console.log('🔌 Initializing Socket.IO connection...');
            
            if (typeof io === 'undefined') {
                console.error('❌ Socket.IO library not loaded!');
                this.updateConnectionStatus('error');
                return;
            }
            
            this.socket = io();
            
            this.socket.on('connect', () => {
                this.updateConnectionStatus('connected');
                console.log('✅ Connected to SRE GPT server via WebSocket');
            });

            this.socket.on('disconnect', () => {
                this.updateConnectionStatus('disconnected');
                console.log('❌ Disconnected from SRE GPT server');
            });

            this.socket.on('connect_error', (error) => {
                console.error('❌ WebSocket connection error:', error);
                this.updateConnectionStatus('error');
            });

            this.socket.on('health_update', (data) => {
                this.updateHealthData(data);
            });

            this.socket.on('chat_response', (response) => {
                this.addChatMessage(response.message, 'bot');
                this.enableChatInput();
            });

            this.socket.on('chat_error', (error) => {
                this.addChatMessage('Sorry, I encountered an error. Please try again.', 'bot');
                this.enableChatInput();
            });

            this.socket.on('dynatrace_event', (event) => {
                this.handleDynatraceEvent(event);
            });

            this.socket.on('critical_alert', (alert) => {
                this.showCriticalAlert(alert);
            });
        } catch (error) {
            console.error('❌ Failed to initialize WebSocket:', error);
            this.updateConnectionStatus('error');
        }
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.refreshDashboard();
        });

        // Clear events button
        document.getElementById('clear-events').addEventListener('click', () => {
            this.clearRecentEvents();
        });

        // Chat input
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });

        sendBtn.addEventListener('click', () => {
            this.sendChatMessage();
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                this.sendChatMessage(message);
            });
        });

        // Initialize theme
        this.initializeTheme();
    }

    async loadInitialData() {
        try {
            console.log('🔄 Loading initial dashboard data...');
            const response = await fetch('/api/dashboard/overview');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ Dashboard data loaded:', data);
            this.updateHealthData(data);
        } catch (error) {
            console.error('❌ Error loading initial data:', error);
            this.showError(`Failed to load dashboard data: ${error.message}`);
        }
    }

    updateConnectionStatus(status) {
        const statusEl = document.getElementById('connection-status');
        statusEl.className = 'status-indicator';
        
        switch (status) {
            case 'connected':
                statusEl.classList.add('status-healthy');
                statusEl.innerHTML = '<span class="w-2 h-2 bg-current rounded-full mr-1"></span>Connected';
                break;
            case 'disconnected':
                statusEl.classList.add('status-critical');
                statusEl.innerHTML = '<span class="w-2 h-2 bg-current rounded-full mr-1"></span>Disconnected';
                break;
            case 'error':
                statusEl.classList.add('status-critical');
                statusEl.innerHTML = '<span class="w-2 h-2 bg-current rounded-full mr-1"></span>Connection Error';
                break;
            default:
                statusEl.classList.add('status-unknown');
                statusEl.innerHTML = '<span class="w-2 h-2 bg-current rounded-full mr-1"></span>Connecting...';
        }
    }

    updateHealthData(data) {
        console.log('📊 Updating dashboard with health data:', data);
        this.healthData = data;
        
        // Update performance metrics
        this.updatePerformanceMetrics(data);
        
        // Update overall health
        this.updateOverallHealth(data);
        
        // Update component statuses
        this.updateComponentStatus('services', data.details.services);
        this.updateComponentStatus('infrastructure', data.details.infrastructure);
        this.updateComponentStatus('databases', data.details.databases);
        this.updateComponentStatus('kubernetes', data.details.kubernetes);
        
        // Update problems
        this.updateProblems(data.details.problems);
        
        // Update last updated timestamp
        this.updateLastUpdated();
        
        console.log('✅ Dashboard updated successfully');
    }

    updateOverallHealth(data) {
        const statusEl = document.getElementById('overall-status');
        const summaryEl = document.getElementById('health-summary');
        
        statusEl.className = 'status-indicator';
        statusEl.classList.add(`status-${data.overallHealth}`);
        statusEl.textContent = data.overallHealth.toUpperCase();
        
        summaryEl.textContent = data.summary;
    }

    updateComponentStatus(component, data) {
        const containerEl = document.getElementById(`${component}-status`);
        if (!containerEl) return;
        
        const statusEl = containerEl.querySelector('.status-indicator');
        const summaryEl = containerEl.querySelector('p');
        
        if (statusEl) {
            statusEl.className = 'status-indicator';
            statusEl.classList.add(`status-${data.status}`);
            statusEl.textContent = data.status.toUpperCase();
        }
        
        if (summaryEl) {
            summaryEl.textContent = data.summary || `${component} status updated`;
        }
    }

    updateProblems(problemsData) {
        const problemsList = document.getElementById('problems-list');
        
        if (problemsData.total === 0) {
            problemsList.innerHTML = '<p class="text-green-600">✅ No active problems detected!</p>';
            return;
        }
        
        let html = `
            <div class="mb-4">
                <div class="flex space-x-4 text-sm">
                    <span class="text-red-600">Critical: ${problemsData.critical}</span>
                    <span class="text-yellow-600">Warnings: ${problemsData.warnings}</span>
                    <span class="text-gray-600">Total: ${problemsData.total}</span>
                </div>
            </div>
        `;
        
        if (problemsData.problems && problemsData.problems.length > 0) {
            html += '<div class="space-y-3">';
            problemsData.problems.slice(0, 5).forEach(problem => {
                const severityClass = problem.severity === 'ERROR' ? 'text-red-600' : 'text-yellow-600';
                const severityIcon = problem.severity === 'ERROR' ? '🚨' : '⚠️';
                
                html += `
                    <div class="border-l-4 ${problem.severity === 'ERROR' ? 'border-red-500' : 'border-yellow-500'} pl-4">
                        <div class="flex items-start">
                            <span class="mr-2">${severityIcon}</span>
                            <div class="flex-1">
                                <h4 class="font-medium ${severityClass}">${problem.title}</h4>
                                <p class="text-sm text-gray-600">
                                    Status: ${problem.status} | 
                                    Affected: ${problem.affectedEntities} entities
                                </p>
                                <p class="text-xs text-gray-500">
                                    Started: ${new Date(problem.startTime).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        problemsList.innerHTML = html;
    }

    sendChatMessage(message = null) {
        const chatInput = document.getElementById('chat-input');
        const messageText = message || chatInput.value.trim();
        
        if (!messageText) return;
        
        // Add user message to chat
        this.addChatMessage(messageText, 'user');
        
        // Clear input and disable
        chatInput.value = '';
        this.disableChatInput();
        
        // Try WebSocket first, fallback to HTTP
        if (this.socket && this.socket.connected) {
            console.log('Sending via WebSocket:', messageText);
            this.socket.emit('chat_message', { message: messageText });
        } else {
            console.log('WebSocket not connected, using HTTP fallback:', messageText);
            this.sendChatMessageHTTP(messageText);
        }
    }

    async sendChatMessageHTTP(message) {
        try {
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            this.addChatMessage(data.message, 'bot');
            this.enableChatInput();
        } catch (error) {
            console.error('Chat HTTP request failed:', error);
            this.addChatMessage('Sorry, I encountered an error. Please try again.', 'bot');
            this.enableChatInput();
        }
    }

    addChatMessage(message, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message chat-${sender}`;
        
        // Convert markdown-like formatting to HTML
        const formattedMessage = this.formatChatMessage(message);
        messageEl.innerHTML = `<div>${formattedMessage}</div>`;
        
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    formatChatMessage(message) {
        // Simple formatting for chat messages
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '• ');
    }

    disableChatInput() {
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        
        chatInput.disabled = true;
        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';
    }

    enableChatInput() {
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        
        chatInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
        chatInput.focus();
    }

    showError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50';
        errorEl.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">❌</span>
                <span>${message}</span>
                <button class="ml-4 text-red-500 hover:text-red-700" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(errorEl);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorEl.parentElement) {
                errorEl.remove();
            }
        }, 5000);
    }

    handleDynatraceEvent(eventData) {
        console.log('Received Dynatrace event:', eventData);
        
        // Add event to recent events list
        this.addRecentEvent(eventData);
        
        // Update chat with event notification
        const eventMessage = this.formatEventMessage(eventData);
        this.addChatMessage(eventMessage, 'bot');
        
        // Refresh health data if it's a problem event
        if (eventData.type === 'problem' && eventData.severity === 'CRITICAL') {
            this.loadInitialData();
        }
    }

    showCriticalAlert(alert) {
        const alertEl = document.createElement('div');
        alertEl.className = 'fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-50 max-w-md';
        alertEl.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <span class="text-2xl">🚨</span>
                </div>
                <div class="ml-3 flex-1">
                    <h3 class="text-sm font-medium">Critical Alert</h3>
                    <p class="mt-1 text-sm">${alert.title}</p>
                    <p class="mt-1 text-xs text-red-600">Status: ${alert.status}</p>
                </div>
                <button class="ml-4 text-red-400 hover:text-red-600" onclick="this.parentElement.parentElement.remove()">
                    <span class="text-lg">&times;</span>
                </button>
            </div>
        `;
        
        document.body.appendChild(alertEl);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (alertEl.parentElement) {
                alertEl.remove();
            }
        }, 10000);
    }

    addRecentEvent(eventData) {
        const eventsContainer = document.getElementById('recent-events');
        if (!eventsContainer) return;
        
        const eventEl = document.createElement('div');
        const isDark = document.documentElement.classList.contains('dark');
        const bgColor = isDark ? 'bg-gray-700' : 'bg-white';
        
        eventEl.className = `p-3 border-l-4 ${this.getEventBorderColor(eventData.severity)} ${bgColor} rounded-r mb-2`;
        
        const timeAgo = this.getTimeAgo(new Date(eventData.timestamp));
        const titleColor = isDark ? 'text-gray-100' : 'text-gray-900';
        const textColor = isDark ? 'text-gray-300' : 'text-gray-600';
        const timeColor = isDark ? 'text-gray-400' : 'text-gray-500';
        
        eventEl.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h4 class="font-medium text-sm ${titleColor}">${eventData.title}</h4>
                    <p class="text-xs ${textColor} mt-1">Type: ${eventData.type} | Status: ${eventData.status}</p>
                </div>
                <span class="text-xs ${timeColor}">${timeAgo}</span>
            </div>
        `;
        
        eventsContainer.insertBefore(eventEl, eventsContainer.firstChild);
        
        // Keep only last 5 events visible
        while (eventsContainer.children.length > 5) {
            eventsContainer.removeChild(eventsContainer.lastChild);
        }
    }

    formatEventMessage(eventData) {
        const emoji = this.getEventEmoji(eventData.type, eventData.severity);
        let message = `${emoji} **${eventData.title}**\n\n`;
        message += `**Type:** ${eventData.type}\n`;
        message += `**Status:** ${eventData.status}\n`;
        message += `**Severity:** ${eventData.severity}\n`;
        
        if (eventData.affectedEntities && eventData.affectedEntities.length > 0) {
            message += `**Affected Entities:** ${eventData.affectedEntities.length}\n`;
        }
        
        message += `**Time:** ${new Date(eventData.timestamp).toLocaleString()}\n`;
        
        return message;
    }

    getEventEmoji(type, severity) {
        if (severity === 'CRITICAL') return '🚨';
        if (severity === 'WARNING') return '⚠️';
        if (type === 'deployment') return '🚀';
        if (type === 'metric') return '📊';
        return 'ℹ️';
    }

    getEventBorderColor(severity) {
        switch (severity) {
            case 'CRITICAL': return 'border-red-500';
            case 'WARNING': return 'border-yellow-500';
            case 'INFO': return 'border-blue-500';
            default: return 'border-gray-300';
        }
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    }

    async loadRecentEvents() {
        try {
            const response = await fetch('/api/webhooks/events?limit=5');
            const data = await response.json();
            
            const eventsContainer = document.getElementById('recent-events');
            if (eventsContainer && data.events) {
                eventsContainer.innerHTML = '';
                data.events.forEach(eventData => this.addRecentEvent(eventData));
            }
        } catch (error) {
            console.error('Error loading recent events:', error);
        }
    }

    // Theme Management
    initializeTheme() {
        console.log('🎨 Initializing theme...');
        
        const savedTheme = localStorage.getItem('sre-gpt-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        console.log('Saved theme:', savedTheme, 'Prefers dark:', prefersDark);
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            const themeIcon = document.getElementById('theme-icon');
            if (themeIcon) themeIcon.textContent = '☀️';
            console.log('✅ Dark mode enabled');
        } else {
            document.documentElement.classList.remove('dark');
            const themeIcon = document.getElementById('theme-icon');
            if (themeIcon) themeIcon.textContent = '🌙';
            console.log('✅ Light mode enabled');
        }
    }

    toggleTheme() {
        console.log('🎨 Toggling theme...');
        
        const isDark = document.documentElement.classList.contains('dark');
        const themeIcon = document.getElementById('theme-icon');
        
        if (isDark) {
            document.documentElement.classList.remove('dark');
            if (themeIcon) themeIcon.textContent = '🌙';
            localStorage.setItem('sre-gpt-theme', 'light');
            console.log('✅ Switched to light mode');
        } else {
            document.documentElement.classList.add('dark');
            if (themeIcon) themeIcon.textContent = '☀️';
            localStorage.setItem('sre-gpt-theme', 'dark');
            console.log('✅ Switched to dark mode');
        }
        
        // Force a small delay to ensure CSS transitions work
        setTimeout(() => {
            console.log('Theme classes applied:', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        }, 100);
    }

    // Performance Metrics
    updatePerformanceMetrics(data) {
        if (data.details.services && data.details.services.services) {
            const services = data.details.services.services;
            
            // Calculate average response time
            const responseTimes = services
                .filter(s => s.metrics && s.metrics.responseTime)
                .map(s => s.metrics.responseTime);
            
            const avgResponseTime = responseTimes.length > 0 
                ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
                : 0;
            
            // Calculate average error rate
            const errorRates = services
                .filter(s => s.metrics && s.metrics.errorRate !== undefined)
                .map(s => s.metrics.errorRate);
            
            const avgErrorRate = errorRates.length > 0
                ? (errorRates.reduce((a, b) => a + b, 0) / errorRates.length).toFixed(1)
                : 0;
            
            // Count active services
            const activeServices = services.filter(s => s.status !== 'down').length;
            
            // Update DOM
            document.getElementById('avg-response-time').textContent = `${avgResponseTime}ms`;
            document.getElementById('error-rate').textContent = `${avgErrorRate}%`;
            document.getElementById('active-services').textContent = `${activeServices}/${services.length}`;
            
            // Add visual indicators
            const responseTimeEl = document.getElementById('avg-response-time').parentElement.parentElement;
            const errorRateEl = document.getElementById('error-rate').parentElement.parentElement;
            
            // Response time color coding
            responseTimeEl.classList.remove('pulse-critical');
            if (avgResponseTime > 1000) {
                responseTimeEl.classList.add('pulse-critical');
            }
            
            // Error rate color coding
            errorRateEl.classList.remove('pulse-critical');
            if (avgErrorRate > 5) {
                errorRateEl.classList.add('pulse-critical');
            }
        }
    }

    updateLastUpdated() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        document.getElementById('last-updated').textContent = timeString;
    }

    clearRecentEvents() {
        const eventsContainer = document.getElementById('recent-events');
        if (eventsContainer) {
            eventsContainer.innerHTML = '<p class="text-gray-600 dark:text-gray-400">No recent events</p>';
        }
    }

    refreshDashboard() {
        console.log('🔄 Manual refresh triggered');
        
        // Show visual feedback
        const refreshBtn = document.getElementById('refresh-btn');
        const originalText = refreshBtn.innerHTML;
        
        refreshBtn.innerHTML = '🔄 Refreshing...';
        refreshBtn.disabled = true;
        refreshBtn.classList.add('opacity-75');
        
        // Load fresh data
        Promise.all([
            this.loadInitialData(),
            this.loadRecentEvents()
        ]).then(() => {
            // Reset button after successful refresh
            setTimeout(() => {
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
                refreshBtn.classList.remove('opacity-75');
                
                // Show success feedback
                this.showSuccessMessage('Dashboard refreshed successfully!');
            }, 500);
        }).catch((error) => {
            // Reset button on error
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
            refreshBtn.classList.remove('opacity-75');
            
            console.error('Refresh failed:', error);
            this.showError('Failed to refresh dashboard');
        });
    }

    showSuccessMessage(message) {
        const successEl = document.createElement('div');
        successEl.className = 'fixed top-4 right-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 px-4 py-3 rounded z-50';
        successEl.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">✅</span>
                <span>${message}</span>
                <button class="ml-4 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(successEl);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (successEl.parentElement) {
                successEl.remove();
            }
        }, 3000);
    }

    // Enhanced status updates with animations
    updateComponentStatus(component, data) {
        const containerEl = document.getElementById(`${component}-status`);
        if (!containerEl) return;
        
        const statusEl = containerEl.querySelector('.status-indicator');
        const summaryEl = containerEl.querySelector('p');
        
        if (statusEl) {
            statusEl.className = 'status-indicator';
            statusEl.classList.add(`status-${data.status}`);
            statusEl.textContent = data.status.toUpperCase();
            
            // Add glow effect for healthy status
            const cardEl = containerEl.closest('.metric-card');
            cardEl.classList.remove('glow-healthy');
            if (data.status === 'healthy') {
                cardEl.classList.add('glow-healthy');
            }
        }
        
        if (summaryEl) {
            summaryEl.textContent = data.summary || `${component} status updated`;
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing SRE GPT Dashboard...');
    try {
        const dashboard = new SREGPTDashboard();
        console.log('✅ Dashboard initialized successfully');
        window.sreGptDashboard = dashboard; // Make available for debugging
    } catch (error) {
        console.error('❌ Failed to initialize dashboard:', error);
    }
});