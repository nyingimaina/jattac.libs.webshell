import React, { ReactNode } from 'react';
import styles from './WebShellHamburgerMenu.module.css';

export type MenuItem<TId> = {
  id: TId; // Mandatory id for each menu item should be unique
  node?: ReactNode;
  link?: {
    url: string;
    label: string;
    target?: string;
    className?: string;
  };
  searchKey?: string;
  children?: MenuItem<TId>[];
};

type WebShellHamburgerMenuProps<TId> = {
  items: MenuItem<TId>[];
  onItemClick: (args: { id: TId; hasChildren: boolean }) => void; // Callback for when a menu item is clicked
};

type WebShellHamburgerMenuState<TId> = {
  isOpen: boolean;
  openSubmenuIndex: number | null; // Index of the currently open submenu
  hoveredId: TId | null; // Index of the currently hovered menu item
  searchQuery: string; // Search query to filter menu items
  backgroundColor: string; // To store dynamic background color
  iconColor: string; // To store the dynamically determined icon color
};

class WebShellHamburgerMenu<TId> extends React.Component<
  WebShellHamburgerMenuProps<TId>,
  WebShellHamburgerMenuState<TId>
> {
  menuRef: React.RefObject<HTMLUListElement>; // Create a ref for the menu
  searchInputRef: React.RefObject<HTMLInputElement>; // Create a ref for the search input
  knownIds: TId[] = [];

  constructor(props: WebShellHamburgerMenuProps<TId>) {
    super(props);
    this.state = {
      isOpen: false,
      openSubmenuIndex: null, // Initially, no submenu is open
      hoveredId: null, // Initially, no item is hovered
      searchQuery: '', // Initially, the search query is empty
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Default frosted glass effect
      iconColor: '#333', // Default icon color
    };
    this.menuRef = React.createRef(); // Initialize the ref for the menu
    this.searchInputRef = React.createRef(); // Initialize the ref for the search input
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateBackgroundColor);
    document.addEventListener('mousedown', this.handleClickOutside); // Add event listener for clicks outside
    this.updateBackgroundColor();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateBackgroundColor);
    document.removeEventListener('mousedown', this.handleClickOutside); // Clean up the event listener
  }

  handleClickOutside = (event: MouseEvent) => {
    if (this.menuRef.current && !this.menuRef.current.contains(event.target as Node)) {
      this.closeMenu();
    }
  };

  closeMenu() {
    this.setState({ isOpen: false, openSubmenuIndex: null, searchQuery: '' });
  }

  updateBackgroundColor = () => {
    const bgColor = window.getComputedStyle(document.body).backgroundColor;
    const color = this.calculateContrastColor(bgColor);

    this.setState({
      backgroundColor: bgColor === 'rgba(0, 0, 0, 0)' ? 'rgba(255, 255, 255, 0.9)' : bgColor,
      iconColor: color,
    });
  };

  calculateContrastColor(bgColor: string): string {
    const rgba = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgba) {
      const r = parseInt(rgba[1]);
      const g = parseInt(rgba[2]);
      const b = parseInt(rgba[3]);
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luminance < 128 ? '#FFF' : '#000'; // White for dark, black for light
    }
    return '#000'; // Fallback to black
  }

  toggleMenu = () => {
    this.setState((prevState) => {
      const newIsOpen = !prevState.isOpen;
      if (newIsOpen) {
        setTimeout(() => {
          if (this.searchInputRef.current) {
            this.searchInputRef.current.focus(); // Focus on search input when menu opens
          }
        }, 0);
      }
      return { isOpen: newIsOpen };
    });
  };

  toggleSubmenu = (index: number) => {
    this.setState((prevState) => ({
      openSubmenuIndex: prevState.openSubmenuIndex === index ? null : index, // Close if already open, else open
    }));
  };

  handleMenuItemClick = (id: TId, hasChildren: boolean, index: number) => {
    this.props.onItemClick({ id, hasChildren }); // Call the provided callback with the item id
    if (hasChildren) {
      this.toggleSubmenu(index); // Toggle the submenu if it has children
    } else {
      this.setState({ isOpen: false, openSubmenuIndex: null }); // Close the menu if it’s not a parent with children
    }
  };

  handleMouseEnter = (id: TId) => {
    this.setState({ hoveredId: id }); // Set the hovered index on mouse enter
  };

  handleMouseLeave = () => {
    this.setState({ hoveredId: null }); // Reset hovered index on mouse leave
  };

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: event.target.value }); // Update search query state
  };

  handleClearClick = () => {
    // Clear the search box and call onSearchChange with an empty string
    this.setState({ searchQuery: '' });
    if (this.searchInputRef.current) {
      this.searchInputRef.current.focus(); // Optionally refocus the input after clearing
    }
  };

  filterItems(items: MenuItem<TId>[], searchQuery: string): MenuItem<TId>[] {
    const lowerQuery = searchQuery.toLowerCase();

    return items.reduce<MenuItem<TId>[]>((acc, item) => {
      // Check if the item matches the search query

      const itemMatches = this.getSearchKey(item).toLowerCase().includes(lowerQuery);

      // Filter the children if they exist
      const filteredChildren = item.children ? this.filterItems(item.children, searchQuery) : [];

      // If the item matches or it has matching children, include it in the results
      if (itemMatches || filteredChildren.length > 0) {
        acc.push({
          ...item,
          children: filteredChildren, // Only include matching children
        });
      }

      return acc;
    }, []);
  }

  private getSearchKey(item: MenuItem<TId>): string {
    if (this.isLink(item)) {
      return item.link!.label;
    } else {
      return item.searchKey ?? '';
    }
  }

  private isLink(item: MenuItem<TId>): boolean {
    return item.link ? true : false;
  }

  private getNode(item: MenuItem<TId>): ReactNode {
    if (this.isLink(item)) {
      const link = item.link!;
      return (
        <a href={link.url} target={link.target} className={link.className}>
          {link.label}
        </a>
      );
    } else {
      if (!item.node) {
        throw new Error(`Item must either be a link or a node`);
      }
      return item.node;
    }
  }

  renderMenuItems(items?: MenuItem<TId>[]) {
    if (!items) {
      return null;
    }
    const { searchQuery } = this.state;

    // Filter items based on the search query
    const filteredItems = items.filter((item) => {
      const result =
        this.getSearchKey(item).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.children &&
          item.children.some((child) => this.getSearchKey(child).toLowerCase().includes(searchQuery.toLowerCase())));
      return result;
    });

    return filteredItems.map((item, index) => {
      if (this.knownIds.some((a) => a === item.id)) {
        throw new Error(`Id ${item.id} has been used before in the menu.\nIds must be unique`);
      } else {
        this.knownIds.push(item.id!);
      }
      const hasChildren = !!item.children;
      const isOpen = this.state.openSubmenuIndex === index;
      const isHovered = this.state.hoveredId === item.id; // Check if the item is hovered

      return (
        <li key={item.id + ''} className={`${styles.menuItem}}`}>
          <div
            className={`${isHovered ? styles.hoveredItem : ''} ${styles.thing} ${!this.state.isOpen ? styles.collapsed : ''}`}
            onClick={() => this.handleMenuItemClick(item.id, hasChildren, index)}
            onMouseEnter={() => this.handleMouseEnter(item.id)} // Handle mouse enter
            onMouseLeave={this.handleMouseLeave} // Handle mouse leave
            style={{ display: 'flex', alignItems: 'center' }} // Apply background based on hover state
          >
            {hasChildren && <span className={styles.icon}>{isOpen ? '▼' : '►'}</span>}

            <span>{this.getNode(item)}</span>
          </div>
          {hasChildren && (
            <ul
              className={`${styles.subMenu} ${isOpen ? styles.open : ''}`} // Add open class if submenu is open
              style={{
                maxHeight: isOpen ? '500px' : '0',
                transition: 'max-height 0.1s ease-in-out',
              }} // Control max height for slide effect
            >
              {this.renderMenuItems(item.children)}
            </ul>
          )}
        </li>
      );
    });
  }

  render() {
    const { isOpen, backgroundColor, iconColor, searchQuery } = this.state;
    this.knownIds = [];
    return (
      <div className={styles.hamburgerMenu}>
        <button
          className={styles.hamburgerButton}
          onClick={this.toggleMenu}
          style={{ color: iconColor }} // Set dynamic icon color
        >
          {isOpen ? (
            <div className={`${styles.backArrow} ${styles.hamburgerIcon}`} />
          ) : (
            <div className={styles.hamburgerIcon} />
          )}
        </button>
        <ul
          ref={this.menuRef} // Attach the ref to the menu
          className={`${styles.menu} ${isOpen ? styles.open : styles.collapsed}`} // Add collapsed class
          style={{ backgroundColor }}
        >
          {isOpen && (
            <li className={styles.menuItem}>
              <div className={styles.searchBar}>
                <div
                  onClick={() => {
                    this.closeMenu();
                  }}
                  className={styles.leftArrow}
                />
                <div className={styles.searchBoxContainer}>
                  <input
                    type="text"
                    ref={this.searchInputRef} // Attach ref for focusing
                    className={styles.searchBox}
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={this.handleSearchChange} // Update search query on input change
                  />
                  {searchQuery && (
                    <span
                      className={styles.clearIcon}
                      onClick={this.handleClearClick} // Clear the search box on click
                    >
                      ✖
                    </span>
                  )}
                </div>
              </div>
            </li>
          )}
          {this.renderMenuItems(this.props.items)}
        </ul>
      </div>
    );
  }
}

export default WebShellHamburgerMenu;
