# vue-wp-list-table

[![npm](https://img.shields.io/npm/v/vue-wp-list-table.svg) ![npm](https://img.shields.io/npm/dm/vue-wp-list-table.svg)](https://www.npmjs.com/package/vue-wp-list-table)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

WordPress List Table component for Vue.js.

Supports:

 * Row Actions with Slot Support
 * Bulk Actions
 * Pagination
 * Custom Column Slot
 * Custom Filter Slot
 * Sorting

## Table of contents

- [Installation](#installation)
- [Usage](#usage)

# Installation

```
npm install --save vue-wp-list-table
```

# Usage

Add the component:

```js
import ListTable from 'vue-wp-list-table';
import 'vue-wp-list-table/dist/vue-wp-list-table.css';

export default {
  name: 'Hello',

  components: {
    ListTable
  },

  data () {
    return {

    };
  },
}

```

```html

<list-table
  :columns="{
    'title': {
      label: 'Title',
      sortable: true
    },
    'author': {
      label: 'Author'
    }
  }"
  :loading="false"
  :rows="[
    {
      id: 1,
      title: 'Wings of Fire: An Autobiography',
      author: ['A.P.J. Abdul Kalam'],
      image: 'https://images.gr-assets.com/books/1295670969l/634583.jpg'
    },
    {
      id: 2,
      title: 'Who Moved My Cheese?',
      author: ['Spencer Johnson', 'Kenneth H. Blanchard'],
      image: 'https://images.gr-assets.com/books/1388639717l/4894.jpg'
    },
    {
      id: 3,
      title: 'Option B',
      author: ['Sheryl Sandberg', 'Adam Grant', 'Adam M. Grant'],
      image: 'https://images.gr-assets.com/books/1493998427l/32938155.jpg'
    }
  ]"
  :actions="[
    {
      key: 'edit',
      label: 'Edit'
    },
    {
      key: 'trash',
      label: 'Delete'
    }
  ]"
  :show-cb="true"
  :total-items="15"
  :bulk-actions="[
    {
      key: 'trash',
      label: 'Move to Trash'
    }
  ]"
  :total-pages="5"
  :per-page="3"
  :current-page="1"
  action-column="title"
  @pagination="goToPage"
  @action:click="onActionClick"
  @bulk:click="onBulkAction"
>
  <template slot="title" slot-scope="data">
    <img :src="data.row.image" :alt="data.row.title" width="50">
    <strong><a href="#">{{ data.row.title }}</a></strong>
  </template>

  <template slot="filters">
    <select>
      <option value="All Dates">All Dates</option>
    </select>

    <button class="button">Filter</button>
  </template>

  <template slot="author" slot-scope="data">
    {{ data.row.author.join(', ') }}
  </template>
</list-table>
```

### Props


| Property       | Type    | Required | Default                               | Description                                                             |
|----------------|---------|----------|---------------------------------------|-------------------------------------------------------------------------|
| `columns`      | Object  | **yes**  | `{}`                                  |                                                                         |
| `rows`         | Array   | **yes**  | `[]`                                  |                                                                         |
| `notFound`     | String  | no       | `No items found.`                     | Shows if no items are found                                             |
| `index`        | String  | no       | `id`                                  | The index identifier of the row                                         |
| `showCb`       | Boolean | no       | `true`                                 | Wheather to show the bulk checkbox in each rows                         |
| `loading`      | Boolean | no       | `false`                               | To show the loading effect, pass `true`                                 |
| `actionColumn` | String  | no       | ` ` (empty)                            | Define which is the action column so we could place action items there. |
| `actions`      | Array   | no       | `[]`                                  | If you want to show row actions, pass an **Array** of **Objects**       |
| `bulkActions`  | Array   | no       | `[]`                                  | Wheather to show the bulk actions                                       |
| `tableClass`   | String  | no       | `wp-list-table widefat fixed striped` | The table classes                                                       |
| `totalItems`   | Number  | no       | `0`                                   | Total count of rows in the database                                     |
| `totalPages`   | Number  | no       | `1`                                   | How many pages are there for pagination                                 |
| `perPage`      | Number  | no       | `20`                                  | Items to show per page                                                  |
| `currentPage`  | Number  | no       | `1`                                   | Current page we are in                                                  |
| `sortBy`       | String  | no       | `null`                                | The property in data on which to initially sort.                        |
| `sortOrder`    | String  | no       | `asc`                                 | The initial sort order.                                                 |
| `text`    | Object  | no       | `{loading: 'Loading', select_bulk_action: 'Select bulk action', bulk_actions: 'Bulk Actions', items: 'items', apply: 'Apply'}`                                 | All static text                                                 |

## Listeners

The table component fires the following events:

**`action:click`**: When a row action is clicked, it fires the event. The action name and the current row will be passed.

```html
<!-- template -->
<list-table
  @action:click="onActionClick"
</list-table>


<!-- method -->
methods: {
  onActionClick(action, row) {
    if ( 'trash' === action ) {
      if ( confirm('Are you sure to delete?') ) {
        alert('deleted: ' + row.title);
      }
    }
  }
}
```

**`bulk:click`**: When a bulk action is performed, this event is fired. The action name and the selected items will be passed as parameters.

```html
<!-- template -->
<list-table
  @bulk:click="onBulkAction"
</list-table>

<!-- method -->
methods: {
  onBulkAction(action, items) {
    console.log(action, items);
    alert(action + ': ' + items.join(', ') );
  }
}
```

**pagination**: When a pagination link is clicked, this event is fired.

```html
<!-- template -->
<list-table
  @pagination="goToPage"
</list-table>

<!-- method -->
methods: {
  goToPage(page) {
    console.log('Going to page: ' + page);
    this.currentPage = page;
    this.loadItems(page);
  }
}
```

**sort**: When a sorted column is clicked

```html
<!-- template -->
<list-table
  @sort="sortCallback"
</list-table>

<!-- method -->
methods: {
  sortCallback(column, order) {
    this.sortBy = column;
    this.sortOrder = order;

    // this.loadItems(comun, order);
  }
}
```

### Loading via Ajax

```html
<!-- template -->
<list-table
  :loading="loading"
  :rows="items"
  @pagination="goToPage"
</list-table>

<!-- method -->
data: {
  return {
    loading: false,
    items: []
  }
},

created() {
  this.loadItems();
},

methods: {

  loadItems() {
    let self = this;

    self.loading = true;

    api.get('/items')
    .then(response, function(data) {
      self.loading = false;
      self.items = data;
    });
  },


  goToPage(page) {
    console.log('Going to page: ' + page);
    this.currentPage = page;
    this.loadItems(page);
  }

}
```

## ⛑ Extra Goodies

Want to get started with WordPress Plugin development with Vue.js? Take a look at [Vue Starter Plugin](https://github.com/tareq1988/vue-wp-starter)

## License

[MIT](http://opensource.org/licenses/MIT)
