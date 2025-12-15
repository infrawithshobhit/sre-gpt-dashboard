# 🎛️ SRE GPT Dashboard Features Explained

## 🔄 **Refresh Button**

**Location**: Top-right corner (🔄 Refresh)

**What it does:**
- Manually fetches the latest data from all monitoring sources
- Updates all dashboard sections: health status, services, problems, events
- Shows visual feedback ("🔄 Refreshing...") while loading
- Displays success message when complete

**When to use:**
- When you want to see the most current data immediately
- After making changes to your infrastructure
- When investigating active incidents
- If you suspect the data might be stale

**Auto-refresh:**
- Dashboard automatically refreshes every 2 minutes via WebSocket
- Manual refresh gives you instant updates without waiting

---

## 🌙 **Dark Mode Toggle**

**Location**: Top-right corner (🌙/☀️ button)

**Features:**
- **Smart Detection**: Automatically uses your system's dark/light preference
- **Persistent**: Remembers your choice across browser sessions
- **Smooth Transitions**: All elements transition smoothly between themes
- **Complete Coverage**: Every UI element adapts to the selected theme

**How to use:**
1. Click the 🌙 (moon) icon to enable dark mode
2. Click the ☀️ (sun) icon to return to light mode
3. Your preference is automatically saved

**Testing Dark Mode:**
- Visit: `http://localhost:3000/test-dark-mode.html`
- This test page verifies dark mode is working correctly
- Toggle between themes to see the smooth transitions

---

## 📊 **Performance Metrics Cards**

**Location**: Top of dashboard (4 colorful cards)

**Metrics displayed:**
1. **⚡ Response Time**: Average response time across all services
2. **🚨 Error Rate**: Average error rate percentage
3. **🔧 Active Services**: Number of healthy services vs total
4. **📈 Uptime**: Overall system uptime percentage

**Visual indicators:**
- Cards pulse red when metrics exceed thresholds
- Real-time updates as new data arrives
- Color-coded for quick status assessment

---

## 🎯 **System Health Overview**

**What it shows:**
- Overall system status (Healthy/Warning/Critical)
- Summary of current system state
- Last updated timestamp
- Component-by-component breakdown

**Status indicators:**
- ✅ **Healthy**: All systems operating normally
- ⚠️ **Warning**: Some issues detected, not critical
- 🚨 **Critical**: Immediate attention required
- ❓ **Unknown**: Status cannot be determined

---

## 🔧 **Component Status Cards**

**Four main categories:**
1. **🔧 Services**: Application services and APIs
2. **🖥️ Infrastructure**: Servers, hosts, and compute resources
3. **🗄️ Databases**: Database instances and connections
4. **☸️ Kubernetes**: Container orchestration and clusters

**Each card shows:**
- Current status with color-coded indicator
- Summary of component health
- Hover effects for better interactivity

---

## 🚨 **Active Problems Section**

**Displays:**
- Total count of active problems
- Breakdown by severity (Critical vs Warnings)
- Detailed list of recent problems
- Problem start times and affected entities

**Problem details include:**
- Severity level with appropriate icons
- Problem title and description
- Current status (Open/Resolved)
- Number of affected entities
- Start time and duration

---

## 📊 **Recent Events**

**Shows:**
- Latest system events and changes
- Event types: deployments, alerts, metrics
- Timestamps with "time ago" format
- Color-coded by severity

**Features:**
- **Clear button**: Remove all events from view
- **Auto-refresh**: New events appear automatically
- **Event details**: Type, status, and timing information

---

## 🤖 **AI Chat Interface**

**Location**: Right sidebar

**Features:**
- **Natural Language**: Ask questions in plain English
- **Smart Responses**: AI understands context and provides detailed answers
- **Quick Actions**: Pre-defined buttons for common queries
- **Real-time**: Instant responses via WebSocket or HTTP fallback

**Example queries:**
- "Which application is down?"
- "Show overall system health"
- "What problems are active?"
- "Explain the current alerts"

**Quick action buttons:**
- 📊 **System Health**: Get overall status summary
- 🚨 **Active Problems**: List current issues
- ⚠️ **Down Apps**: Find services that are offline
- 🔧 **Services**: Show service performance details

---

## 🎨 **Visual Features**

**Animations:**
- Smooth color transitions between themes
- Pulse effects for critical alerts
- Glow effects for healthy services
- Loading states with visual feedback

**Responsive Design:**
- Works on desktop, tablet, and mobile
- Adaptive layout for different screen sizes
- Touch-friendly interface elements

**Accessibility:**
- High contrast colors in both themes
- Keyboard navigation support
- Screen reader friendly
- Clear visual hierarchy

---

## 🔧 **Troubleshooting**

**If dark mode isn't working:**
1. Try the test page: `http://localhost:3000/test-dark-mode.html`
2. Check browser console for JavaScript errors
3. Clear browser cache and cookies
4. Try in incognito/private browsing mode

**If refresh button doesn't work:**
1. Check network connectivity
2. Verify server is running (`npm start`)
3. Look for errors in browser console
4. Try refreshing the entire page (F5)

**If data isn't loading:**
1. Check that the server is running on port 3000
2. Verify API endpoints are responding
3. Run diagnostics: `npm run diagnose`
4. Check server logs for errors

---

## 💡 **Pro Tips**

1. **Keyboard Shortcuts:**
   - Press Enter in chat input to send messages
   - Use Tab to navigate between elements

2. **Performance:**
   - Dashboard auto-refreshes every 2 minutes
   - Manual refresh gives instant updates
   - WebSocket provides real-time data when connected

3. **Customization:**
   - Theme preference is saved per browser
   - Chat history is maintained during session
   - Recent events can be cleared manually

4. **Mobile Usage:**
   - Dashboard is fully responsive
   - Touch-friendly buttons and inputs
   - Optimized for mobile viewing

Your SRE GPT dashboard is designed to be intuitive and powerful, providing all the monitoring insights you need in a beautiful, accessible interface! 🚀