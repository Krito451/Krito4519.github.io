// 全局变量
let spiritCount = 5; // 默认每队精灵数量
let banTime = 30; // 默认禁用时间（秒）
let pickTime = 30; // 默认选择时间（秒）
let teamNames = {
    blue: '蓝队',
    red: '红队'
};
let currentTimer;
let isSelectionStarted = false;
let isPaused = false;
let currentStep = 0;
let currentTeam = 'blue';
let currentSlot = 0;
let currentSelectionStart;
let selectionHistory = [];
let shouldShowPhaseNotification = true;

// 在全局变量区域添加
let isDeleteMode = false;

// 定义 phases 数组
const phases = [
    { team: 'blue', action: 'ban' },
    { team: 'red', action: 'ban' },
    { team: 'blue', action: 'ban' },
    { team: 'red', action: 'ban' },
    { team: 'blue', action: 'ban' },
    { team: 'red', action: 'ban' },
    { team: 'blue', action: 'pick' },
    { team: 'red', action: 'pick' },
    { team: 'red', action: 'pick' },
    { team: 'blue', action: 'pick' },
    { team: 'blue', action: 'pick' },
    { team: 'red', action: 'pick' },
    { team: 'blue', action: 'ban' },
    { team: 'red', action: 'ban' },
    { team: 'blue', action: 'ban' },
    { team: 'red', action: 'ban' },
    { team: 'red', action: 'pick' },
    { team: 'blue', action: 'pick' },
    { team: 'blue', action: 'pick' },
    { team: 'red', action: 'pick' }
];

// 在全局变量区域添加
const totalSteps = phases.length;

// 定义 selectedSpirits 和 bannedSpirits
let selectedSpirits = { blue: [], red: [] };
let bannedSpirits = { blue: [], red: [] };

// 将精灵数组设置为空
const spirits = [];

// 添加一个函数来添加新的精灵
function addSpirit(name, attribute, rarity, types) {
    const newId = spirits.length > 0 ? Math.max(...spirits.map(s => s.id)) + 1 : 1;
    const newSpirit = { id: newId, name, attribute, rarity, types };
    spirits.push(newSpirit);
    saveSpirits();
    showSpiritPool();
    updateSpellPool();
}

// 添加一个函数来保存精灵数据
function saveSpirits() {
    localStorage.setItem('spirits', JSON.stringify(spirits));
}

// 添加一个函数来加载精灵数据
function loadSpirits() {
    const savedSpirits = localStorage.getItem('spirits');
    if (savedSpirits) {
        spirits.push(...JSON.parse(savedSpirits));
    }
}

// 在 init 函数中调用 loadSpirits
function init() {
    console.log('Initializing application');
    loadSettings();
    loadSelectionHistory();
    loadSpirits();
    setupEventListeners();
    updateSpiritCount();
    populateSpellPool();
    setupBackgroundChange(); // 添加这行
    console.log('Initialization complete');
}

// 添加一个函数来显示添加精灵的表单
function showAddSpiritForm() {
    const form = document.createElement('form');
    form.innerHTML = `
        <h3>添加新精灵</h3>
        <input type="text" id="spirit-name" placeholder="精灵名称" required>
        <select id="spirit-attribute" required>
            <option value="">选择属性</option>
            <option value="神火">神火</option>
            <option value="神水">神水</option>
            <option value="神草">神草</option>
            <option value="神光">神光</option>
            <option value="神暗">神暗</option>
            <option value="神灵">神灵</option>
            <option value="神幻">神幻</option>
            <option value="神无极">神无极</option>
        </select>
        <select id="spirit-rarity" required>
            <option value="">选择时代</option>
            <option value="启元">启元</option>
            <option value="星迹">星迹</option>
            <option value="神运">神运</option>
        </select>
        <div id="spirit-types">
            <label><input type="checkbox" name="spirit-type" value="神平衡"> 神平衡</label>
            <label><input type="checkbox" name="spirit-type" value="神攻"> 神攻</label>
            <label><input type="checkbox" name="spirit-type" value="神速"> 神速</label>
            <label><input type="checkbox" name="spirit-type" value="神盾"> 神盾</label>
            <label><input type="checkbox" name="spirit-type" value="神通灵师"> 神通灵师</label>
            <label><input type="checkbox" name="spirit-type" value="超级英雄"> 超级英雄</label>
            <label><input type="checkbox" name="spirit-type" value="神召唤师"> 神召唤师</label>
            <label><input type="checkbox" name="spirit-type" value="幻元师"> 幻元师</label>
            <label><input type="checkbox" name="spirit-type" value="元素师"> 元素师</label>
            <label><input type="checkbox" name="spirit-type" value="赋能师"> 赋能师</label>
            <label><input type="checkbox" name="spirit-type" value="天觉者"> 天觉者</label>
        </div>
        <button type="submit">添加精灵</button>
    `;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('spirit-name').value;
        const attribute = document.getElementById('spirit-attribute').value;
        const rarity = document.getElementById('spirit-rarity').value;
        const types = Array.from(document.querySelectorAll('input[name="spirit-type"]:checked')).map(input => input.value);
        if (types.length === 0) {
            alert('请至少选择一个职业');
            return;
        }
        addSpirit(name, attribute, rarity, types);
        this.reset();
    });
    
    const modalContent = document.querySelector('#spirit-pool-modal .modal-content');
    modalContent.appendChild(form);
}

// 修改 setupEventListeners 函数
function setupEventListeners() {
    const addEventListenerSafely = (id, event, handler) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, handler);
        } else {
            console.warn(`Element with id "${id}" not found`);
        }
    };

    addEventListenerSafely('attribute-filter', 'change', filterSpirits);
    addEventListenerSafely('rarity-filter', 'change', filterSpirits);
    addEventListenerSafely('type-filter', 'change', filterSpirits);
    addEventListenerSafely('search-input', 'input', filterSpirits);
    addEventListenerSafely('pause-button', 'click', togglePause);
    addEventListenerSafely('start-button', 'click', startSelection);
    addEventListenerSafely('spirit-count', 'change', updateSpiritCount);
    addEventListenerSafely('reset-button', 'click', resetSelection);
    addEventListenerSafely('history-button', 'click', showHistory);
    addEventListenerSafely('clear-history-button', 'click', clearHistory);
    addEventListenerSafely('timer-settings-button', 'click', showTimerSettings);
    addEventListenerSafely('save-timer-settings', 'click', saveTimerSettings);
    addEventListenerSafely('spirit-pool-button', 'click', showSpiritPool);
    addEventListenerSafely('add-spirit-button', 'click', showAddSpiritForm);
    addEventListenerSafely('import-spirits-button', 'click', () => {
        document.getElementById('import-spirits-file').click();
    });
    addEventListenerSafely('import-images-button', 'click', () => {
        document.getElementById('import-images-file').click();
    });
    addEventListenerSafely('import-images-file', 'change', handleImageFilesSelect);

    document.querySelectorAll('.close').forEach(el => {
        el.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    document.querySelectorAll('.edit-team-name').forEach(button => {
        button.addEventListener('click', editTeamName);
    });

    const deleteModeButton = document.getElementById('delete-mode-button');
    if (deleteModeButton) {
        deleteModeButton.addEventListener('click', toggleDeleteMode);
    }

    document.getElementById('type-filter-button').addEventListener('click', showTypeFilterModal);
    document.querySelector('#type-filter-modal .close').addEventListener('click', closeTypeFilterModal);
    document.getElementById('apply-type-filter').addEventListener('click', applyTypeFilter);

    // 为每个复选框添加事件监听器
    document.querySelectorAll('#type-filter-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterSpirits);
    });
}

// 更新精灵数量
function updateSpiritCount() {
    const spiritCountInput = document.getElementById('spirit-count');
    if (spiritCountInput) {
        spiritCount = parseInt(spiritCountInput.value);
        createCharacterSlots();
        saveSettings(); // 保存设置
    }
}

// 创建角色槽位
function createCharacterSlots() {
    const blueSlots = document.querySelector('#blue-team .character-slots');
    const redSlots = document.querySelector('#red-team .character-slots');

    if (!blueSlots || !redSlots) {
        console.error('Character slots elements not found');
        return;
    }

    blueSlots.innerHTML = '';
    redSlots.innerHTML = '';

    for (let i = 0; i < spiritCount; i++) {
        const blueSlot = document.createElement('div');
        blueSlot.className = 'character-slot';
        blueSlot.dataset.team = 'blue';
        blueSlot.dataset.slot = i;
        blueSlots.appendChild(blueSlot);

        const redSlot = document.createElement('div');
        redSlot.className = 'character-slot';
        redSlot.dataset.team = 'red';
        redSlot.dataset.slot = i;
        redSlots.appendChild(redSlot);
    }
}

// 开始选择
function startSelection() {
    console.log('Starting selection');
    isSelectionStarted = true;
    isPaused = false;
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('pause-button').style.display = 'inline-block';
    document.getElementById('pause-button').textContent = '暂停';
    
    const spiritCountInput = document.getElementById('spirit-count');
    const banTimeInput = document.getElementById('ban-time');
    const pickTimeInput = document.getElementById('pick-time');
    if (spiritCountInput) spiritCountInput.disabled = true;
    if (banTimeInput) banTimeInput.disabled = true;
    if (pickTimeInput) pickTimeInput.disabled = true;
    
    selectedSpirits = { blue: [], red: [] };
    bannedSpirits = { blue: [], red: [] };
    currentStep = 0;
    currentTeam = 'blue';
    currentSlot = 0;
    currentSelectionStart = new Date();

    // 清空之前的选择和禁用显示
    document.querySelector('#blue-team .banned-spirits').innerHTML = '';
    document.querySelector('#red-team .banned-spirits').innerHTML = '';
    document.querySelector('#blue-team .selected-spirits').innerHTML = '';
    document.querySelector('#red-team .selected-spirits').innerHTML = '';

    // 显示开始选择的提醒
    showNotification('精灵选择开始！', true, 1000);

    // 确保显示第一个阶段的提示
    shouldShowPhaseNotification = true;

    // 延迟更新阶段显示，以确保开始提示和第一个阶段提示不重叠
    setTimeout(() => {
        updatePhaseDisplay();
        updateSpellPool();
        startTurnTimer();
    }, 1100);
}

// 更阶段示
function updatePhaseDisplay() {
    const phaseElement = document.getElementById('phase-display');
    const currentPhase = phases[currentStep];
    const teamName = teamNames[currentPhase.team];
    const action = currentPhase.action === 'ban' ? '禁用' : '选择';
    const message = `${teamName}${action}`;
    phaseElement.textContent = message;

    if (shouldShowPhaseNotification) {
        showNotification(`现在是${message}阶段`, true, 1000);
    }
}

// 选择精灵
function selectSpirit(spirit) {
    console.log('Attempting to select spirit:', spirit);
    if (!isSelectionStarted || isPaused) return;

    const currentPhase = phases[currentStep];
    
    // 检查精灵是否已被禁用或被任何一方选择
    if (bannedSpirits.blue.includes(spirit) || 
        bannedSpirits.red.includes(spirit) || 
        selectedSpirits.blue.includes(spirit) || 
        selectedSpirits.red.includes(spirit)) {
        console.log('This spirit is banned or already selected and cannot be chosen');
        return;
    }

    if (currentPhase.action === 'ban') {
        banSpirit(spirit, currentPhase.team);
    } else {
        pickSpirit(spirit, currentPhase.team);
    }

    currentStep++;
    console.log('Current step:', currentStep, 'Total steps:', totalSteps);
    if (currentStep >= totalSteps) {
        console.log('Selection process completed');
        endSelection();
    } else {
        updatePhaseDisplay();
        resetTurnTimer();
    }
    
    // 更新精灵池显示
    updateSpellPool();
}

// 禁用精灵
function banSpirit(spirit, team) {
    bannedSpirits[team].push(spirit);
    updateBannedSpirits(team, spirit);
    console.log(`${team} banned ${spirit.name}`);
}

// 选择精灵
function pickSpirit(spirit, team) {
    selectedSpirits[team].push(spirit);
    updateSelectedSpirits(team, spirit);
    updateCharacterSlot(team, selectedSpirits[team].length - 1, spirit);
    console.log(`${team} picked ${spirit.name}`);
}

// 更新禁用的精灵显示
function updateBannedSpirits(team, spirit) {
    const bannedArea = document.querySelector(`#${team}-team .banned-spirits`);
    const spiritElement = document.createElement('div');
    spiritElement.className = 'banned-spirit';
    spiritElement.textContent = spirit.name;
    bannedArea.appendChild(spiritElement);
}

// 更新选择的精灵显示
function updateSelectedSpirits(team, spirit) {
    const selectedArea = document.querySelector(`#${team}-team .selected-spirits`);
    const spiritElement = document.createElement('div');
    spiritElement.className = 'selected-spirit';
    spiritElement.textContent = spirit.name;
    selectedArea.appendChild(spiritElement);
}

// 更新角色槽位
function updateCharacterSlot(team, slot, spirit) {
    console.log('Updating slot:', team, slot, spirit);
    const slotElement = document.querySelector(`#${team}-team .character-slots .character-slot:nth-child(${slot + 1})`);
    if (slotElement) {
        slotElement.innerHTML = ''; // 清空槽位
        if (spirit.imageData) {
            const img = document.createElement('img');
            img.src = spirit.imageData;
            img.alt = spirit.name;
            img.title = `${spirit.name}\n属性: ${spirit.attribute}\n时代: ${spirit.rarity}\n职业: ${spirit.types.join(', ')}`;
            slotElement.appendChild(img);
        } else {
            slotElement.textContent = spirit.name;
        }
        slotElement.title = `${spirit.name}\n属性: ${spirit.attribute}\n时代: ${spirit.rarity}\n职业: ${spirit.types.join(', ')}`;
    } else {
        console.error('Slot element not found:', team, slot);
    }
}

// 过滤精灵
function filterSpirits() {
    const attribute = document.getElementById('attribute-filter').value;
    const rarity = document.getElementById('rarity-filter').value;
    const selectedTypes = Array.from(document.querySelectorAll('#type-filter-modal input:checked')).map(input => input.value);
    const search = document.getElementById('search-input').value.toLowerCase();

    const spiritsGrid = document.getElementById('spirits-grid');
    spiritsGrid.innerHTML = '';

    spirits.filter(spirit => {
        const attributeMatch = attribute === '' || spirit.attribute === attribute;
        const rarityMatch = rarity === '' || spirit.rarity === rarity;
        const typeMatch = selectedTypes.length === 0 || selectedTypes.every(type => spirit.types.includes(type));
        const searchMatch = search === '' || spirit.name.toLowerCase().includes(search) || spirit.id.toString().includes(search);

        return attributeMatch && rarityMatch && typeMatch && searchMatch;
    }).forEach(spirit => {
        const spiritItem = document.createElement('div');
        spiritItem.className = 'spirit-item';
        if (spirit.imageData) {
            spiritItem.innerHTML = `<img src="${spirit.imageData}" alt="${spirit.name}" title="${spirit.name}">`;
        } else {
            spiritItem.innerHTML = `<span>${spirit.name}</span>`;
        }
        spiritItem.title = `${spirit.name}\n属性: ${spirit.attribute}\n时代: ${spirit.rarity}\n职业: ${spirit.types.join(', ')}`;
        
        if (isDeleteMode) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-spirit';
            deleteButton.textContent = '删除';
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                deleteSpirit(spirit.id);
            };
            spiritItem.appendChild(deleteButton);
        } else {
            if (bannedSpirits.blue.includes(spirit)) {
                spiritItem.classList.add('banned', 'banned-blue');
            } else if (bannedSpirits.red.includes(spirit)) {
                spiritItem.classList.add('banned', 'banned-red');
            } else if (selectedSpirits.blue.includes(spirit)) {
                spiritItem.classList.add('selected', 'selected-blue');
            } else if (selectedSpirits.red.includes(spirit)) {
                spiritItem.classList.add('selected', 'selected-red');
            } else {
                spiritItem.addEventListener('click', () => selectSpirit(spirit));
            }
        }
        
        spiritsGrid.appendChild(spiritItem);
    });
}

// 确保在页面加载完成后添加事件监听器
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('attribute-filter').addEventListener('change', filterSpirits);
    document.getElementById('rarity-filter').addEventListener('change', filterSpirits);
    document.querySelectorAll('#type-filter-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterSpirits);
    });
    document.getElementById('search-input').addEventListener('input', filterSpirits);
});

// 开始回合计时器
function startTurnTimer() {
    if (currentStep >= phases.length) {
        console.log('Selection process completed');
        endSelection();
        return;
    }

    const currentPhase = phases[currentStep];
    let timeLeft;
    
    // 检查是否是选择两只精灵的阶段
    if (currentPhase.action === 'pick' && 
        ((currentStep === 7 && currentPhase.team === 'red') || 
         (currentStep === 9 && currentPhase.team === 'blue'))) {
        timeLeft = Math.round(pickTime * 1.5); // 1.5倍选择时间，四舍五入到整数
    } else {
        timeLeft = currentPhase.action === 'ban' ? banTime : pickTime;
    }

    const timerElement = document.querySelector(`#${currentPhase.team}-team .team-timer`);

    function updateTimer() {
        if (isPaused) return;

        timerElement.textContent = timeLeft.toString().padStart(2, '0');
        timerElement.classList.toggle('warning', timeLeft <= 10);

        if (timeLeft > 0) {
            timeLeft--;
            currentTimer = setTimeout(updateTimer, 1000);
        } else {
            handleTimeout();
        }
    }

    clearTimeout(currentTimer);
    updateTimer();
}

// 重置回合计时器
function resetTurnTimer() {
    document.querySelectorAll('.team-timer').forEach(el => {
        el.textContent = '';
        el.classList.remove('warning');
    });
    startTurnTimer();
}

// 处理超时
function handleTimeout() {
    if (currentStep >= phases.length) {
        console.log('Selection process completed');
        endSelection();
        return;
    }

    const currentPhase = phases[currentStep];
    if (currentPhase.action === 'ban') {
        // 如果是禁用阶段超时，直接进入下一步
        currentStep++;
        if (currentStep >= phases.length) {
            endSelection();
        } else {
            updatePhaseDisplay();
            startTurnTimer();
        }
    } else {
        // 如果是选择阶段超时
        const availableSpirits = spirits.filter(spirit => 
            !bannedSpirits.blue.includes(spirit) && 
            !bannedSpirits.red.includes(spirit) && 
            !selectedSpirits.blue.includes(spirit) && 
            !selectedSpirits.red.includes(spirit)
        );
        
        // 检查是否是选择两只精灵的阶段
        const selectCount = (currentStep === 7 && currentPhase.team === 'red') || 
                            (currentStep === 9 && currentPhase.team === 'blue') ? 2 : 1;
        
        for (let i = 0; i < selectCount; i++) {
            if (availableSpirits.length > 0) {
                const randomSpirit = availableSpirits[Math.floor(Math.random() * availableSpirits.length)];
                selectSpirit(randomSpirit);
                // 从可用精灵列表中移除已选择的精灵
                const index = availableSpirits.indexOf(randomSpirit);
                if (index > -1) {
                    availableSpirits.splice(index, 1);
                }
            } else {
                // 如果没有可用的精灵，直接进入下一步
                break;
            }
        }
        
        // 更新步骤
        currentStep++;
        if (currentStep >= phases.length) {
            endSelection();
        } else {
            updatePhaseDisplay();
            startTurnTimer();
        }
    }
}

// 切换暂停状态
function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pause-button').textContent = isPaused ? '继续' : '暂停';
}

// 结束选择
function endSelection() {
    isSelectionStarted = false;
    document.getElementById('start-button').style.display = 'inline-block';
    document.getElementById('pause-button').style.display = 'none';
    
    const spiritCountInput = document.getElementById('spirit-count');
    if (spiritCountInput) {
        spiritCountInput.disabled = false;
    }
    
    // 添加本次选择记录到历史
    selectionHistory.push({
        id: Date.now(),
        timestamp: currentSelectionStart,
        teamNames: { ...teamNames }, // 保存当前的队伍名称
        blueTeam: {
            banned: bannedSpirits.blue.map(s => s.name),
            selected: selectedSpirits.blue.map(s => s.name)
        },
        redTeam: {
            banned: bannedSpirits.red.map(s => s.name),
            selected: selectedSpirits.red.map(s => s.name)
        }
    });
    
    saveSelectionHistory(); // 保存历史记录
    
    alert('精灵选择已结束！');
    console.log('Final selection:', selectedSpirits);
    console.log('Banned spirits:', bannedSpirits);
    console.log('Selection history:', selectionHistory);
}

// 填充精灵池
function populateSpellPool() {
    updateSpellPool();
}

// 更新精灵池显示
function updateSpellPool() {
    console.log('Updating spell pool');
    const spiritsGrid = document.getElementById('spirits-grid');
    spiritsGrid.innerHTML = '';

    spirits.forEach(spirit => {
        const spiritItem = document.createElement('div');
        spiritItem.className = 'spirit-item';
        if (spirit.imageData) {
            spiritItem.innerHTML = `<img src="${spirit.imageData}" alt="${spirit.name}" title="${spirit.name}">`;
        } else {
            spiritItem.innerHTML = `<span>${spirit.name}</span>`;
        }
        spiritItem.title = `${spirit.name}\n属性: ${spirit.attribute}\n时代: ${spirit.rarity}\n职业: ${spirit.types.join(', ')}`;
        
        if (isDeleteMode) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-spirit';
            deleteButton.textContent = '删除';
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                deleteSpirit(spirit.id);
            };
            spiritItem.appendChild(deleteButton);
        } else {
            if (bannedSpirits.blue.includes(spirit)) {
                spiritItem.classList.add('banned', 'banned-blue');
            } else if (bannedSpirits.red.includes(spirit)) {
                spiritItem.classList.add('banned', 'banned-red');
            } else if (selectedSpirits.blue.includes(spirit)) {
                spiritItem.classList.add('selected', 'selected-blue');
            } else if (selectedSpirits.red.includes(spirit)) {
                spiritItem.classList.add('selected', 'selected-red');
            } else {
                spiritItem.addEventListener('click', () => selectSpirit(spirit));
            }
        }
        
        spiritsGrid.appendChild(spiritItem);
    });
    console.log('Spell pool updated');
}

// 重置选择
function resetSelection() {
    if (confirm('确定要重置择吗？这将清除当前的选择，但不会影响历史记录。')) {
        // 设置标志为 false，阻止显示阶段提示
        shouldShowPhaseNotification = false;

        // 重置选择状态
        selectedSpirits = { blue: [], red: [] };
        bannedSpirits = { blue: [], red: [] };
        currentStep = 0;
        currentTeam = 'blue';
        currentSlot = 0;
        isSelectionStarted = false;
        isPaused = false;

        // 更新界面
        updatePhaseDisplay();
        updateSpellPool();
        createCharacterSlots();
        
        // 清空禁用和选择的精灵显示
        document.querySelector('#blue-team .banned-spirits').innerHTML = '';
        document.querySelector('#red-team .banned-spirits').innerHTML = '';
        document.querySelector('#blue-team .selected-spirits').innerHTML = '';
        document.querySelector('#red-team .selected-spirits').innerHTML = '';
        
        // 重置按钮状态
        document.getElementById('start-button').style.display = 'inline-block';
        document.getElementById('pause-button').style.display = 'none';
        document.getElementById('pause-button').textContent = '暂停';
        
        // 重置计时器
        clearTimeout(currentTimer);
        document.querySelectorAll('.team-timer').forEach(timer => {
            timer.textContent = '';
        });
        
        // 用精灵数量输入
        const spiritCountInput = document.getElementById('spirit-count');
        if (spiritCountInput) {
            spiritCountInput.disabled = false;
        }

        console.log('Selection reset');

        // 重新绑定事件监听器
        setupEventListeners();

        // 重置成后，将标志设回 true
        shouldShowPhaseNotification = true;
    }
}

// 显示史
function showHistory() {
    const historyContent = document.getElementById('history-content');
    historyContent.innerHTML = '';
    const filteredHistory = selectionHistory.filter(record => record.action !== 'reset');
    
    if (filteredHistory.length === 0) {
        historyContent.innerHTML = '<p>暂无历史记录</p>';
        document.getElementById('clear-history-button').style.display = 'none';
    } else {
        document.getElementById('clear-history-button').style.display = 'block';
        filteredHistory.forEach((record) => {
            if (record.timestamp && record.blueTeam && record.redTeam) {
                const recordElement = document.createElement('div');
                recordElement.className = 'history-record';
                const date = new Date(record.timestamp);
                recordElement.innerHTML = `
                    <h3>选择 - ${date.toLocaleString()}</h3>
                    <div class="team-history">
                        <div class="blue-team">
                            <h4>${record.teamNames?.blue || '蓝队'}</h4>
                            <p>禁用: ${record.blueTeam.banned ? record.blueTeam.banned.join(', ') : '无'}</p>
                            <p>选择: ${record.blueTeam.selected ? record.blueTeam.selected.join(', ') : '无'}</p>
                        </div>
                        <div class="red-team">
                            <h4>${record.teamNames?.red || '红队'}</h4>
                            <p>禁用: ${record.redTeam.banned ? record.redTeam.banned.join(', ') : '无'}</p>
                            <p>选择: ${record.redTeam.selected ? record.redTeam.selected.join(', ') : '无'}</p>
                        </div>
                    </div>
                    <button class="delete-record" data-id="${record.id}">删除此记录</button>
                `;
                historyContent.appendChild(recordElement);
            }
        });
        
        // 为所有删除按钮添加事件监听器
        document.querySelectorAll('.delete-record').forEach(button => {
            button.addEventListener('click', function() {
                deleteRecord(this.dataset.id);
            });
        });
    }
    document.getElementById('history-modal').style.display = 'block';
}

// 关闭历史模态框
function closeHistory() {
    document.getElementById('history-modal').style.display = 'none';
}

// 添加删除单条记录的函
function deleteRecord(id) {
    if (confirm('确定要删除这条记录吗？')) {
        selectionHistory = selectionHistory.filter(record => record.id != id);
        saveSelectionHistory();
        showHistory(); // 重新显示历史记录
    }
}

// 修改 clearHistory 函数
function clearHistory() {
    if (confirm('确定要清除所有历史记录吗？此操作不可撤销。')) {
        selectionHistory = [];
        saveSelectionHistory();
        showHistory(); // 重新显示空的历史记录
        console.log('History cleared');
    }
}

// 加载历史记录
function loadSelectionHistory() {
    const savedHistory = localStorage.getItem('selectionHistory');
    if (savedHistory) {
        selectionHistory = JSON.parse(savedHistory);
    }
}

// 保存历史记录
function saveSelectionHistory() {
    localStorage.setItem('selectionHistory', JSON.stringify(selectionHistory));
}

// 添加提醒函数
function showNotification(message, isCenter = false, duration = 1000) {
    const existingNotification = document.querySelector('.notification, .center-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = isCenter ? 'center-notification' : 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, duration);
}

function showTimerSettings() {
    document.getElementById('ban-time').value = banTime;
    document.getElementById('pick-time').value = pickTime;
    document.getElementById('timer-settings-modal').style.display = 'block';
}

function closeTimerSettings() {
    document.getElementById('timer-settings-modal').style.display = 'none';
}

function saveTimerSettings() {
    banTime = parseInt(document.getElementById('ban-time').value);
    pickTime = parseInt(document.getElementById('pick-time').value);
    closeTimerSettings();
    saveSettings(); // 保存设置
}

// 添加编辑队伍名称的函数
function editTeamName(event) {
    const team = event.target.dataset.team;
    const newName = prompt(`请输入${team === 'blue' ? '蓝队' : '红队'}的新名称：`, teamNames[team]);
    if (newName && newName.trim() !== '') {
        teamNames[team] = newName.trim();
        document.querySelector(`#${team}-team .team-name`).textContent = newName.trim();
        saveSettings(); // 保存设置
    }
}

// 添加这个函数到文件中的适当位置，比如在 loadSelectionHistory 函数附近

// 加载设置
function loadSettings() {
    const savedSpiritCount = localStorage.getItem('spiritCount');
    const savedBanTime = localStorage.getItem('banTime');
    const savedPickTime = localStorage.getItem('pickTime');
    const savedTeamNames = localStorage.getItem('teamNames');

    if (savedSpiritCount) {
        spiritCount = parseInt(savedSpiritCount);
        document.getElementById('spirit-count').value = spiritCount;
    }
    if (savedBanTime) {
        banTime = parseInt(savedBanTime);
        document.getElementById('ban-time').value = banTime;
    }
    if (savedPickTime) {
        pickTime = parseInt(savedPickTime);
        document.getElementById('pick-time').value = pickTime;
    }
    if (savedTeamNames) {
        teamNames = JSON.parse(savedTeamNames);
        document.querySelector('#blue-team .team-name').textContent = teamNames.blue;
        document.querySelector('#red-team .team-name').textContent = teamNames.red;
    }
}

// 保存设置
function saveSettings() {
    localStorage.setItem('spiritCount', spiritCount);
    localStorage.setItem('banTime', banTime);
    localStorage.setItem('pickTime', pickTime);
    localStorage.setItem('teamNames', JSON.stringify(teamNames));
}

// 初始化应用
document.addEventListener('DOMContentLoaded', init);

// 修改 toggleDeleteMode 函数
function toggleDeleteMode() {
    isDeleteMode = !isDeleteMode;
    const deleteModeButton = document.getElementById('delete-mode-button');
    if (deleteModeButton) {
        deleteModeButton.textContent = isDeleteMode ? '退出删除模式' : '删除';
        deleteModeButton.classList.toggle('active', isDeleteMode);
    }
    updateSpellPool(); // 刷新精灵池显示
}

// 修改 showSpiritPool 函数
function showSpiritPool() {
    const spiritPoolModal = document.getElementById('spirit-pool-modal');
    const modalContent = spiritPoolModal.querySelector('.modal-content');
    
    // 清空现有内容
    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <h2>精灵池</h2>
        <div class="spirit-pool-buttons">
            <button id="add-spirit-button">添加新精灵</button>
            <button id="import-spirits-button">导入精灵数据</button>
            <button id="import-images-button">导入图片</button>
        </div>
        <input type="file" id="import-spirits-file" accept=".json" style="display: none;">
        <input type="file" id="import-images-file" accept="image/*" multiple style="display: none;">
        <div id="spirit-pool-list"></div>
    `;

    // 重新添加事件监听器
    modalContent.querySelector('.close').addEventListener('click', closeSpiritPool);
    document.getElementById('add-spirit-button').addEventListener('click', showAddSpiritForm);
    document.getElementById('import-spirits-button').addEventListener('click', () => {
        document.getElementById('import-spirits-file').click();
    });
    document.getElementById('import-images-button').addEventListener('click', () => {
        document.getElementById('import-images-file').click();
    });
    document.getElementById('import-spirits-file').addEventListener('change', handleSpiritFileSelect);
    document.getElementById('import-images-file').addEventListener('change', handleImageFilesSelect);

    // 显示精灵列表
    const spiritPoolList = document.getElementById('spirit-pool-list');
    spiritPoolList.innerHTML = '';
    spirits.forEach(spirit => {
        const spiritItem = document.createElement('div');
        spiritItem.className = 'spirit-item';
        if (spirit.imageData) {
            spiritItem.innerHTML = `<img src="${spirit.imageData}" alt="${spirit.name}">`;
        } else {
            spiritItem.innerHTML = `<span>${spirit.name}</span>`;
        }
        spiritItem.innerHTML += `
            <span>${spirit.attribute} | ${spirit.rarity} | ${spirit.types.join(', ')}</span>
        `;
        spiritPoolList.appendChild(spiritItem);
    });

    spiritPoolModal.style.display = 'block';
}

// 添加关闭精灵池的函数
function closeSpiritPool() {
    document.getElementById('spirit-pool-modal').style.display = 'none';
}

// 修 deleteSpirit 函数
function deleteSpirit(id) {
    const password = prompt('请输入密码以删除精灵：');
    if (password === '17704638160') {
        const index = spirits.findIndex(spirit => spirit.id === id);
        if (index !== -1) {
            if (confirm(`确定要删除精灵 "${spirits[index].name}" 吗？`)) {
                spirits.splice(index, 1);
                saveSpirits();
                updateSpellPool(); // 更新主界面的精灵池显示
            }
        }
    } else {
        alert('密码错误，无法删除精灵。');
    }
}

// 修改 importSpirits 函数
function importSpirits() {
    // 不再直接触发文件选择
    alert('请先选择精灵数据的 JSON 文件，然后选择对应的图片文件。');
}

// 修改 handleSpiritFileSelect 函数
function handleSpiritFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            try {
                const importedSpirits = JSON.parse(content);
                spirits.push(...importedSpirits);
                saveSpirits();
                updateSpellPool();
                showSpiritPool();
                alert('精灵据导入成功请现在选择对应的图片文件。');
                // 不再动触发图片择
            } catch (error) {
                alert('无效的 JSON 文件。请检查文件格式。');
            }
        };
        reader.readAsText(file);
    }
}

// 处理图片文件选择
function handleImageFilesSelect(event) {
    console.log('Image files selected:', event.target.files);
    const files = event.target.files;
    if (files.length > 0) {
        let processedCount = 0;
        let successCount = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log('Processing file:', file.name);
            const reader = new FileReader();
            reader.onload = function(e) {
                console.log('File read successfully:', file.name);
                const fileName = file.name.split('.')[0];
                const spiritId = parseInt(fileName);
                console.log('Searching for spirit with ID:', spiritId);
                const spirit = spirits.find(s => s.id === spiritId);
                if (spirit) {
                    console.log('Spirit found:', spirit.name);
                    spirit.imageData = e.target.result;
                    successCount++;
                    console.log(`Successfully processed image for spirit: ${spirit.name}`);
                } else {
                    console.warn(`No matching spirit found for image: ${file.name}`);
                }
                processedCount++;

                if (processedCount === files.length) {
                    console.log('All files processed');
                    saveSpirits();
                    updateSpellPool();
                    showSpiritPool();
                    alert(`处理完成！成功导入 ${successCount} 张图片，失败 ${files.length - successCount} 张。`);
                }
            };
            reader.onerror = function(e) {
                console.error('Error reading file:', file.name, e);
                processedCount++;
            };
            reader.readAsDataURL(file);
        }
    } else {
        console.log('No image files selected');
        alert('没有选择任何图片文件。');
    }
}

// 添加以下函数
function showTypeFilterModal() {
    document.getElementById('type-filter-modal').style.display = 'block';
}

function closeTypeFilterModal() {
    document.getElementById('type-filter-modal').style.display = 'none';
}

function applyTypeFilter() {
    filterSpirits();
    closeTypeFilterModal();
}

function setupBackgroundChange() {
    const backgroundInput = document.getElementById('background-image-input');
    const changeBackgroundButton = document.getElementById('change-background-button');

    changeBackgroundButton.addEventListener('click', () => {
        backgroundInput.click();
    });

    backgroundInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.body.style.backgroundImage = `url(${e.target.result})`;
                // 保存背景图片到本地存储
                localStorage.setItem('backgroundImage', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // 页面加载时检查是否有保存的背景图片
    const savedBackgroundImage = localStorage.getItem('backgroundImage');
    if (savedBackgroundImage) {
        document.body.style.backgroundImage = `url(${savedBackgroundImage})`;
    }
}

// 在 init 函数中调用 setupBackgroundChange
function init() {
    console.log('Initializing application');
    loadSettings();
    loadSelectionHistory();
    loadSpirits();
    setupEventListeners();
    updateSpiritCount();
    populateSpellPool();
    setupBackgroundChange(); // 添加这行
    console.log('Initialization complete');
}