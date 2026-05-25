const fs = require('fs');
let html = fs.readFileSync('extension/popup.html', 'utf8');

// Tooltips for inputs
html = html.replace('<input type="text" id="username" placeholder="Leave empty for random name">', '<input type="text" id="username" placeholder="Leave empty for random name" title="Your display name in the room">');
html = html.replace('<input type="text" id="roomId" placeholder="Enter Room ID">', '<input type="text" id="roomId" placeholder="Enter Room ID" title="The unique ID of the room you want to join">');
html = html.replace('<input type="password" id="password" placeholder="Room Password (optional)">', '<input type="password" id="password" placeholder="Room Password (optional)" title="Password for the room (leave empty if none)">');

// Tooltips for buttons
html = html.replace('<button id="joinBtn" class="primary">Join Room</button>', '<button id="joinBtn" class="primary" title="Connect to the room">Join Room</button>');
html = html.replace('<button id="leaveBtn" class="primary" style="display:none; background: var(--error);">Leave Room</button>', '<button id="leaveBtn" class="primary" style="display:none; background: var(--error);" title="Disconnect from the room">Leave Room</button>');
html = html.replace('<button id="createRoomBtn" class="primary">Create New Room</button>', '<button id="createRoomBtn" class="primary" title="Create a new random room and join it">Create New Room</button>');
html = html.replace('<button id="refreshRooms" class="secondary">↻ Refresh List</button>', '<button id="refreshRooms" class="secondary" title="Refresh the list of public rooms">↻ Refresh List</button>');
html = html.replace('<button id="playBtn" class="primary" style="flex:1; background: var(--success);">▶ Play</button>', '<button id="playBtn" class="primary" style="flex:1; background: var(--success);" title="Send a Play command to everyone">▶ Play</button>');
html = html.replace('<button id="pauseBtn" class="primary" style="flex:1; background: var(--error);">⏸ Pause</button>', '<button id="pauseBtn" class="primary" style="flex:1; background: var(--error);" title="Send a Pause command to everyone">⏸ Pause</button>');
html = html.replace('<button id="forceSyncBtn" class="primary" style="background: linear-gradient(135deg, #6366f1, #a855f7); flex: 1;">⚡ SYNC</button>', '<button id="forceSyncBtn" class="primary" style="background: linear-gradient(135deg, #6366f1, #a855f7); flex: 1;" title="Force all users to sync up">⚡ SYNC</button>');
html = html.replace('<button id="copyInvite" class="secondary" style="margin-top: 0; white-space: nowrap;">Copy Invite</button>', '<button id="copyInvite" class="secondary" style="margin-top: 0; white-space: nowrap;" title="Copy the room invite link to clipboard">Copy Invite</button>');

// Tooltips for tabs
html = html.replace('<button class="tab-btn active" data-tab="tab-room">Room</button>', '<button class="tab-btn active" data-tab="tab-room" title="Room settings and connection">Room</button>');
html = html.replace('<button class="tab-btn" data-tab="tab-sync" id="tabSyncBtn" style="display:none;">Sync</button>', '<button class="tab-btn" data-tab="tab-sync" id="tabSyncBtn" style="display:none;" title="Remote control and video selection">Sync</button>');
html = html.replace('<button class="tab-btn" data-tab="tab-settings">Settings</button>', '<button class="tab-btn" data-tab="tab-settings" title="Extension preferences">Settings</button>');
html = html.replace('<button class="tab-btn" data-tab="tab-dev">Status</button>', '<button class="tab-btn" data-tab="tab-dev" title="Connection status and debug logs">Status</button>');

// Remove explicit ℹ️ where not needed since it's hidden now
html = html.replace('>Hide Clutter Tabs ℹ️<', ' title="Filters out non-video tabs and unrelated domains to keep the list clean">Hide Clutter Tabs<');
html = html.replace('>Auto-Sync Next Episode ℹ️<', ' title="Automatically clicks \'Next Episode\' on supported sites like Netflix when others do">Auto-Sync Next Episode<');
html = html.replace('>Auto-copy invite on Create ℹ️<', ' title="Automatically copies the invite link to your clipboard when you create a new room">Auto-copy invite on Create<');
html = html.replace('>Browser Notifications ℹ️<', ' title="Shows native system notifications when someone joins/leaves or plays/pauses.">Browser Notifications<');

// Fix onboarding layout
html = html.replace('align-items:center; justify-content:center;">', 'align-items:flex-end; justify-content:center; padding-bottom: 20px;">');
html = html.replace('margin-top: 50px;', '');

fs.writeFileSync('extension/popup.html', html, 'utf8');

let js = fs.readFileSync('extension/popup.js', 'utf8');

const newAvatarFn = `function getAvatarForName(username) {
    if (!username) return '👤';
    const lower = username.toLowerCase();
    const map = {
        'koala': '🐨', 'panda': '🐼', 'tiger': '🐯', 'eagle': '🦅',
        'fox': '🦊', 'bear': '🐻', 'wolf': '🐺', 'lion': '🦁',
        'hawk': '🦅', 'seal': '🦭', 'owl': '🦉', 'shark': '🦈',
        'dragon': '🐉', 'phoenix': '🐦', 'falcon': '🦅', 'panther': '🐆',
        'raven': '🐦‍⬛', 'cobra': '🐍', 'lynx': '🐈', 'jaguar': '🐆',
        'orca': '🐋', 'mantis': '🦗', 'viper': '🐍', 'condor': '🦅',
        'badger': '🦡', 'otter': '🦦', 'rhino': '🦏', 'crane': '🦩',
        'mongoose': '🦦', 'specter': '👻'
    };
    for (const [key, emoji] of Object.entries(map)) {
        if (lower.includes(key)) return emoji;
    }
    return '👤';
}`;

js = js.replace(/function getAvatarForName\(username\) \{[\s\S]*?return '👤';\n\}/, newAvatarFn);

fs.writeFileSync('extension/popup.js', js, 'utf8');
console.log("Fixed UI");
