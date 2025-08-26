# TNES Development Standards

## 🚫 **NEVER DO:**

### **Don't Disable/Remove Features**
- ❌ Never remove Tailwind CSS, libraries, or working features
- ❌ Never create placeholder/sample components to "get around" issues
- ❌ Never rewrite from scratch when debugging is the solution
- ❌ Never abandon working functionality

### **Don't Take Shortcuts**
- ❌ Never use inline styles when CSS classes should work
- ❌ Never create "temporary" solutions that become permanent
- ❌ Never ignore TypeScript errors instead of fixing them

## ✅ **ALWAYS DO:**

### **Debug First, Never Replace**
1. **Identify the root cause** of issues before changing code
2. **Fix the underlying problem** rather than working around it
3. **Preserve existing functionality** while fixing bugs
4. **Test fixes thoroughly** before moving on

### **Systematic Problem Solving**
1. **Read error messages carefully** - they usually tell you exactly what's wrong
2. **Check imports and dependencies** before assuming code is broken
3. **Verify configuration files** (tailwind.config.js, package.json, etc.)
4. **Use browser dev tools** to inspect CSS and debug styling issues

### **Code Quality Standards**
1. **Always use Tailwind CSS** for styling (never inline styles as primary solution)
2. **Always fix TypeScript errors** properly (never ignore with @ts-ignore)
3. **Always maintain component structure** and existing patterns
4. **Always test changes** in the browser before considering them complete

### **When Debugging UI Issues:**
1. **Check if CSS is loading** (inspect element, look for classes)
2. **Verify Tailwind imports** in index.css
3. **Check tailwind.config.js** for proper content paths
4. **Look for console errors** that might break CSS loading
5. **Test responsive classes** at different screen sizes

### **Architecture Principles**
1. **Maintain component separation** - screens, components, utils, stores
2. **Keep store logic clean** and well-typed
3. **Use proper TypeScript types** throughout the application
4. **Follow React best practices** for hooks and state management

## 🔧 **Current Tech Stack (NEVER REMOVE):**
- **Vite** - Build tool
- **React 19** + TypeScript - Frontend framework
- **Tailwind CSS** - Styling (primary method)
- **Framer Motion** - Animations
- **Zustand** - State management
- **Custom CSS** - Only for specific fantasy theme elements

## 📋 **Issue Resolution Process:**
1. **Reproduce the issue** reliably
2. **Check browser console** for errors
3. **Inspect elements** to see what's actually rendering
4. **Verify imports and dependencies** are correct
5. **Fix the root cause** systematically
6. **Test the fix** thoroughly
7. **Document the solution** if it was non-obvious

## 💡 **Remember:**
- Every issue has a root cause that can be debugged and fixed
- Working features should never be disabled - only improved
- Systematic debugging always beats rewriting
- The goal is to build, not rebuild