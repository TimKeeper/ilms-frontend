import { setCustomIconsLoader } from '@iconify/vue';

type IconifyIconData = {
  body: string;
  height?: number;
  hFlip?: boolean;
  hidden?: boolean;
  left?: number;
  rotate?: number;
  top?: number;
  vFlip?: boolean;
  width?: number;
};

type IconifyAliasData = Omit<IconifyIconData, 'body'> & {
  parent: string;
};

type IconifyCollection = {
  aliases?: Record<string, IconifyAliasData>;
  height?: number;
  icons: Record<string, IconifyIconData>;
  left?: number;
  not_found?: string[];
  prefix: string;
  provider?: string;
  top?: number;
  width?: number;
};

const OFFLINE_ICON_COLLECTIONS: Record<string, IconifyCollection> = {
  lucide: {
    aliases: {
      'bar-chart': {
        parent: 'chart-no-axes-column-increasing',
      },
      'file-bar-chart': {
        parent: 'file-chart-column-increasing',
      },
      home: {
        parent: 'house',
      },
    },
    height: 24,
    icons: {
      activity: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
      },
      battery: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M22 14v-4"/><rect width="16" height="12" x="2" y="6" rx="2"/></g>',
      },
      bell: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.268 21a2 2 0 0 0 3.464 0m-10.47-5.674A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
      },
      'chart-no-axes-column-increasing': {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 21v-6m7 6V9m7 12V3"/>',
      },
      container: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z"/><path d="M10 21.9V14L2.1 9.1M10 14l11.9-6.9M14 19.8v-8.1m4 5.8V9.4"/></g>',
      },
      download: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 15V3m9 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10l5 5l5-5"/></g>',
      },
      'file-chart-column-increasing': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5M8 18v-2m4 2v-4m4 4v-6"/></g>',
      },
      history: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9a9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5m4-1v5l4 2"/></g>',
      },
      house: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></g>',
      },
      map: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0zm.894.211v15M9 3.236v15"/>',
      },
      'map-pin': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></g>',
      },
      'map-pin-check': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19.43 12.935c.357-.967.57-1.955.57-2.935a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0a32 32 0 0 0 .813-.728"/><circle cx="12" cy="10" r="3"/><path d="m16 18l2 2l4-4"/></g>',
      },
      percent: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></g>',
      },
      radar: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34M4 6h.01M2.29 9.62a10 10 0 1 0 19.02-1.27"/><path d="M16.24 7.76a6 6 0 1 0-8.01 8.91M12 18h.01m5.98-6.34a6 6 0 0 1-2.22 5.01"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59l5.66-5.66"/></g>',
      },
      route: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></g>',
      },
      settings: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></g>',
      },
      'settings-2': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M14 17H5M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></g>',
      },
      tag: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></g>',
      },
      truck: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2m10 0H9m10 0h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></g>',
      },
      user: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></g>',
      },
    },
    prefix: 'lucide',
    width: 24,
  },
  mdi: {
    height: 24,
    icons: {
      'home-outline': {
        body: '<path fill="currentColor" d="m12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81zM12 3L2 12h3v8h6v-6h2v6h6v-8h3"/>',
      },
      'keyboard-esc': {
        body: '<path fill="currentColor" d="M1 7h6v2H3v2h4v2H3v2h4v2H1zm10 0h4v2h-4v2h2a2 2 0 0 1 2 2v2c0 1.11-.89 2-2 2H9v-2h4v-2h-2a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2m8 0h2a2 2 0 0 1 2 2v1h-2V9h-2v6h2v-1h2v1c0 1.11-.89 2-2 2h-2a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2"/>',
      },
    },
    prefix: 'mdi',
    width: 24,
  },
  ep: {
    height: 1024,
    icons: {
      expand: {
        body: '<path fill="currentColor" d="M128 192h768v128H128zm0 256h512v128H128zm0 256h768v128H128zm576-352l192 160l-192 128z"/>',
      },
      fold: {
        body: '<path fill="currentColor" d="M896 192H128v128h768zm0 256H384v128h512zm0 256H128v128h768zM320 384L128 512l192 128z"/>',
      },
    },
    prefix: 'ep',
    width: 1024,
  },
  'fluent-mdl2': {
    height: 2048,
    icons: {
      'world-clock': {
        body: '<path fill="currentColor" d="M896 768H512V256h128v384h256zm1152 640q0 87-22 168t-64 152t-100 130t-128 101t-152 66t-168 23q-134 0-251-49t-205-136t-139-204t-51-251q0-132 50-248t138-204t203-137t249-51q132 0 248 50t204 138t137 203t51 249m-640 512q21 0 37-15t29-40t21-53t15-58t9-53t5-37h-230q1 13 5 37t10 52t15 58t21 54t27 39t36 16m125-384q3-64 3-128q0-63-3-128h-250q-3 65-3 128q0 64 3 128zm-637-128q0 32 4 64t12 64h243q-6-128 0-256H912q-8 32-12 64t-4 64m512-512q-19 0-34 15t-27 40t-21 54t-15 58t-11 53t-5 36h225q-1-11-5-34t-11-52t-16-59t-21-54t-27-41t-32-16m253 384q3 64 3 128t-2 128h242q8-32 12-64t4-64t-4-64t-12-64zm190-128q-43-75-108-131t-145-89q20 53 32 108t20 112zm-637-218q-78 32-142 88t-107 130h200q7-56 18-110t31-108m-249 730q42 73 105 129t142 88q-20-52-30-107t-17-110zm643 215q77-32 139-87t104-128h-198q-5 55-15 109t-30 106M640 0q88 0 170 23t153 64t129 100t100 130t65 153t23 170h-128q0-106-40-199t-110-162t-163-110t-199-41t-199 40t-162 110t-110 163t-41 199t40 199t110 162t163 110t199 41v128q-88 0-170-23t-153-64t-129-100T88 963T23 810T0 640q0-132 50-248t138-204T391 51T640 0"/>',
      },
    },
    prefix: 'fluent-mdl2',
    width: 2048,
  },
  'ant-design': {
    height: 1024,
    icons: {
      'upload-outlined': {
        body: '<path fill="currentColor" d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 0 0-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13M878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8"/>',
      },
    },
    prefix: 'ant-design',
    width: 1024,
  },
};

const OFFLINE_ICON_NAMES = Object.freeze(
  Object.fromEntries(
    Object.entries(OFFLINE_ICON_COLLECTIONS).map(([prefix, collection]) => [
      prefix,
      [
        ...Object.keys(collection.icons),
        ...Object.keys(collection.aliases ?? {}),
      ]
        .toSorted()
        .map((name) => `${prefix}:${name}`),
    ]),
  ) as Record<string, string[]>,
);

function createOfflineIconCollection(
  prefix: string,
  requestedIcons: string[],
): IconifyCollection | null {
  const collection = OFFLINE_ICON_COLLECTIONS[prefix];

  if (!collection) {
    return null;
  }

  const icons: Record<string, IconifyIconData> = {};
  const aliases: Record<string, IconifyAliasData> = {};
  const missing = new Set<string>();
  const visited = new Set<string>();

  const visit = (name: string) => {
    if (visited.has(name)) {
      return;
    }

    visited.add(name);

    const icon = collection.icons[name];
    if (icon) {
      icons[name] = icon;
      return;
    }

    const alias = collection.aliases?.[name];
    if (alias) {
      aliases[name] = alias;
      visit(alias.parent);
      return;
    }

    missing.add(name);
  };

  requestedIcons.forEach((element) => {
    visit(element);
  });

  const iconSet: IconifyCollection = {
    icons,
    prefix: collection.prefix,
  };

  if (collection.width !== undefined) {
    iconSet.width = collection.width;
  }
  if (collection.height !== undefined) {
    iconSet.height = collection.height;
  }
  if (collection.left !== undefined) {
    iconSet.left = collection.left;
  }
  if (collection.top !== undefined) {
    iconSet.top = collection.top;
  }
  if (collection.provider !== undefined) {
    iconSet.provider = collection.provider;
  }
  if (Object.keys(aliases).length > 0) {
    iconSet.aliases = aliases;
  }
  if (missing.size > 0) {
    iconSet.not_found = [...missing];
  }

  return iconSet;
}

function getOfflineIconNames(prefix: string) {
  return OFFLINE_ICON_NAMES[prefix] ?? [];
}

function hasOfflineIconCollection(prefix: string) {
  return prefix in OFFLINE_ICON_COLLECTIONS;
}

let isOfflineIconifyRegistered = false;

function registerOfflineIconify() {
  if (isOfflineIconifyRegistered) {
    return;
  }

  isOfflineIconifyRegistered = true;

  for (const prefix of Object.keys(OFFLINE_ICON_COLLECTIONS)) {
    setCustomIconsLoader(
      (icons) => createOfflineIconCollection(prefix, icons),
      prefix,
    );
  }
}

registerOfflineIconify();

export {
  getOfflineIconNames,
  hasOfflineIconCollection,
  registerOfflineIconify,
};
