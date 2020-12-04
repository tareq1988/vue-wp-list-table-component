<template>
  <div :class="{ 'table-loading': loading }">

    <div class="table-loader-wrap" v-if="loading">
      <div class="table-loader-center">
        <div class="table-loader">{{ text.loading }}</div>
      </div>
    </div>

    <div class="tablenav top">

      <div class="alignleft actions bulkactions" v-if="hasBulkActions">
        <label for="bulk-action-selector-top" class="screen-reader-text">{{ text.select_bulk_action }}</label>

        <select name="action" id="bulk-action-selector-top" v-model="bulkLocal">
          <option value="-1">{{ text.bulk_actions }}</option>
          <option v-for="action in bulkActions" :value="action.key">{{ action.label }}</option>
        </select>

        <button class="button action" @click.prevent="handleBulkAction" :disabled="!checkedItems.length">{{ text.apply }}</button>
      </div>

      <div class="alignleft actions">
        <slot name="filters"></slot>
      </div>

      <div class="tablenav-pages">
        <span class="displaying-num">{{ itemsTotal }} {{ text.items }}</span>

        <span class="pagination-links" v-if="hasPagination">
          <span v-if="disableFirst" class="tablenav-pages-navspan button disabled" aria-hidden="true">&laquo;</span>
          <a v-else href="#" class="first-page button" @click.prevent="goToPage(1);"><span aria-hidden="true">&laquo;</span></a>

          <span v-if="disablePrev" class="tablenav-pages-navspan button disabled" aria-hidden="true">&lsaquo;</span>
          <a v-else href="#" class="prev-page button" @click.prevent="goToPage(currentPage - 1);"><span aria-hidden="true">&lsaquo;</span></a>

          <span class="paging-input">
            <span class="tablenav-paging-text">
              <input class="current-page" type="text" name="paged" :value="currentPage" aria-describedby="table-paging" size="1" @keyup.enter="goToCustomPage" /> of
              <span class='total-pages'>{{ totalPages }}</span>
            </span>
          </span>

          <span v-if="disableNext" class="tablenav-pages-navspan button disabled" aria-hidden="true">&rsaquo;</span>
          <a v-else href="#" class="next-page button" @click.prevent="goToPage(currentPage + 1);"><span aria-hidden="true">&rsaquo;</span></a>

          <span v-if="disableLast" class="tablenav-pages-navspan button disabled" aria-hidden="true">&raquo;</span>
          <a v-else href="#" class="last-page button" @click.prevent="goToPage(totalPages)"><span aria-hidden="true">&raquo;</span></a>
        </span>
      </div>
    </div>
    <table :class="tableClass">
      <thead>
        <tr>
          <td v-if="showCb" class="manage-column column-cb check-column"><input type="checkbox" v-model="selectAll"></td>
          <th v-for="(value, key) in columns" :class="[
            'column',
            key,
            { 'sortable': isSortable(value) },
            { 'sorted': isSorted(key) },
            { 'asc': isSorted(key) && sortOrder === 'asc' },
            { 'desc': isSorted(key) && sortOrder === 'desc' }
          ]">
            <template v-if="!isSortable(value)">
              {{ value.label }}
            </template>
            <a href="#" v-else @click.prevent="handleSortBy(key)">
              <span>{{ value.label }}</span>
              <span class="sorting-indicator"></span>
            </a>
          </th>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <td v-if="showCb" class="manage-column column-cb check-column"><input type="checkbox" v-model="selectAll"></td>
          <th v-for="(value, key) in columns" :class="['column', key]">{{ value.label }}</th>
        </tr>
      </tfoot>
      <tbody>
        <template v-if="rows.length">
          <tr v-for="row in rows" :key="row[index]">
            <th scope="row" class="check-column" v-if="showCb">
              <input type="checkbox" name="item[]" :value="row[index]" v-model="checkedItems">
            </th>
            <td v-for="(value, key) in columns" :class="['column', key]">
              <slot :name="key" :row="row">
                {{ row[key] }}
              </slot>

              <div v-if="actionColumn === key && hasActions" class="row-actions">
                <slot name="row-actions" :row="row">
                  <span v-for="action in actions" :class="action.key">
                    <a href="#" @click.prevent="actionClicked(action.key, row)">{{ action.label }}</a>
                    <template v-if="!hideActionSeparator(action.key)"> | </template>
                  </span>
                </slot>
              </div>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td :colspan="colspan">{{ notFound }}</td>
        </tr>
      </tbody>
    </table>
    <div class="tablenav bottom">
      <div class="alignleft actions bulkactions" v-if="hasBulkActions">
        <label for="bulk-action-selector-top" class="screen-reader-text">{{ text.select_bulk_action }}</label>

        <select name="action" id="bulk-action-selector-top" v-model="bulkLocal">
          <option value="-1">{{ text.bulk_actions }}</option>
          <option v-for="action in bulkActions" :value="action.key">{{ action.label }}</option>
        </select>

        <button class="button action" @click.prevent="handleBulkAction" :disabled="!checkedItems.length">Apply</button>
      </div>

      <div class="tablenav-pages">
        <span class="displaying-num">{{ itemsTotal }} {{ text.items }}</span>

        <span class="pagination-links" v-if="hasPagination">
          <span v-if="disableFirst" class="tablenav-pages-navspan button disabled" aria-hidden="true">&laquo;</span>
          <a v-else href="#" class="first-page button" @click.prevent="goToPage(1);"><span aria-hidden="true">&laquo;</span></a>

          <span v-if="disablePrev" class="tablenav-pages-navspan button disabled" aria-hidden="true">&lsaquo;</span>
          <a v-else href="#" class="prev-page button" @click.prevent="goToPage(currentPage - 1);"><span aria-hidden="true">&lsaquo;</span></a>

          <span class="paging-input">
            <span class="tablenav-paging-text">
              {{ currentPage }} of
              <span class='total-pages'>{{ totalPages }}</span>
            </span>
          </span>

          <span v-if="disableNext" class="tablenav-pages-navspan button disabled" aria-hidden="true">&rsaquo;</span>
          <a v-else href="#" class="next-page button" @click.prevent="goToPage(currentPage + 1);"><span aria-hidden="true">&rsaquo;</span></a>

          <span v-if="disableLast" class="tablenav-pages-navspan button disabled" aria-hidden="true">&raquo;</span>
          <a v-else href="#" class="last-page button" @click.prevent="goToPage(totalPages)"><span aria-hidden="true">&raquo;</span></a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'ListTable',

  props: {
    columns: {
      type: Object,
      required: true,
      default: {},
    },
    rows: {
      type: Array, // String, Number, Boolean, Function, Object, Array
      required: true,
      default: [],
    },
    index: {
      type: String,
      default: 'id',
    },
    showCb: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    actionColumn: {
      type: String,
      default: '',
    },
    actions: {
      type: Array,
      required: false,
      default: [],
    },
    bulkActions: {
      type: Array,
      required: false,
      default: [],
    },
    tableClass: {
      type: String,
      default: 'wp-list-table widefat fixed striped',
    },
    notFound: {
      type: String,
      default: 'No items found.',
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPages: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Number,
      default: 20,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    sortBy: {
      type: String,
      default: null,
    },
    sortOrder: {
      type: String,
      default: "asc",
    },
    text: {
      type: Object,
      default: () => {
        return {
          loading: 'Loading',
          select_bulk_action: 'Select bulk action',
          bulk_actions: 'Bulk Actions',
          items: 'items',
          apply: 'Apply',
        }
      }
    }
  },

  data () {
    return {
      bulkLocal: '-1',
      checkedItems: [],
    }
  },

  computed: {

    hasActions() {
      return this.actions.length > 0;
    },

    hasBulkActions() {
      return this.bulkActions.length > 0;
    },

    itemsTotal() {
      return this.totalItems || this.rows.length;
    },

    hasPagination() {
      return this.itemsTotal > this.perPage;
    },

    disableFirst() {
      if ( this.currentPage === 1 || this.currentPage === 2 ) {
        return true;
      }

      return false;
    },

    disablePrev() {
      if ( this.currentPage === 1 ) {
        return true;
      }

      return false;
    },

    disableNext() {
      if ( this.currentPage === this.totalPages ) {
        return true;
      }

      return false;
    },

    disableLast() {
      if ( this.currentPage === this.totalPages || this.currentPage == (this.totalPages - 1)) {
        return true;
      }

      return false;
    },

    colspan() {
      let columns = Object.keys(this.columns).length;

      if ( this.showCb ) {
        columns += 1;
      }

      return columns;
    },

    selectAll: {

      get: function () {
        if ( ! this.rows.length ) {
          return false;
        }

        return this.rows ? this.checkedItems.length == this.rows.length : false;
      },

      set: function (value) {
        var selected = [],
          self = this;

        if (value) {
          this.rows.forEach(function (item) {
            if( item[self.index] !== undefined ) {
              selected.push(item[self.index]);
            } else {
              selected.push(item.id);
            }
          });
        }

        this.checkedItems = selected;
      }
    }
  },

  methods: {

    hideActionSeparator(action) {
      return action === this.actions[this.actions.length -1].key;
    },

    actionClicked(action, row) {
      this.$emit('action:click', action, row);
    },

    goToPage(page) {
      this.$emit('pagination', page);
    },

    goToCustomPage(event) {
      let page = parseInt(event.target.value);

      if ( ! isNaN(page) && ( page > 0 && page <= this.totalPages ) ) {
        this.$emit('pagination', page);
      }
    },

    handleBulkAction() {
      if ( this.bulkLocal === '-1' ) {
        return;
      }

      this.$emit('bulk:click', this.bulkLocal, this.checkedItems);
    },

    isSortable(column) {
      if (column.hasOwnProperty('sortable') && column.sortable === true) {
        return true;
      }

      return false;
    },

    isSorted(column) {
      return column === this.sortBy;
    },

    handleSortBy(column) {
      let order = this.sortOrder === 'asc' ? 'desc': 'asc';

      this.$emit('sort', column, order);
    }
  }
}
</script>

<style lang="less">

.table-loading {
  position: relative;

  .table-loader-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 9;

    .table-loader-center {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
    }
  }

  .wp-list-table,
  .tablenav {
    opacity: 0.4;
  }
}

.table-loader {
  font-size: 10px;
  margin: 50px auto;
  text-indent: -9999em;
  width: 11em;
  height: 11em;
  border-radius: 50%;
  background: #ffffff;
  background: -moz-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  background: -webkit-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  background: -o-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  background: -ms-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  background: linear-gradient(to right, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  position: relative;
  -webkit-animation: tableLoading 1s infinite linear;
  animation: tableLoading 1s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);

  &:before {
  width: 50%;
  height: 50%;
  background: #ffffff;
  border-radius: 100% 0 0 0;
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  }

  &:after {
  background: #f4f4f4;
  width: 75%;
  height: 75%;
  border-radius: 50%;
  content: '';
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  }
}

@-webkit-keyframes tableLoading {
  0% {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  }
  100% {
  -webkit-transform: rotate(360deg);
  transform: rotate(360deg);
  }
}
@keyframes tableLoading {
  0% {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  }
  100% {
  -webkit-transform: rotate(360deg);
  transform: rotate(360deg);
  }
}

</style>
