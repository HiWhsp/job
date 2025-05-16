<template>
    <div class="custom-pagination">
        <el-pagination :background="background" :total="total" :pager-count="pager_count"
            :current-page="pagination.page" :page-size="pagination.pageNum" :page-sizes="page_sizes"
            @size-change="onSizeChange" @current-change="onCurrentChange"
            layout="total, sizes, prev, pager, next, jumper">
            <!-- <span class="custom-current-page">
                <span> {{ pagination.pageNum }}/{{ totalPage }} </span>
            </span> -->
        </el-pagination>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "w-pagination",
    components: {},
    props: {
        background: {
            type: Boolean,
            default: true
        },
        total: {
            type: Number,
            default: 0
        },
        pagination: {
            type: Object,
            default: function () {
                return {
                    // page: 1,
                    // pageSize: 5
                };
            },
        },
        pager_count: {//页码按钮的数量，当总页数超过该值时会折叠
            type: Number,
            default: 5
        },
        page_sizes: {
            type: Array,
            default: function () {
                return [10, 20, 50, 100, 200];
            },
        },
    },
    data() {
        return {

        };
    },
    computed: {
        // ...mapState([]),
        totalPage() {
            return Math.ceil(this.total / this.pagination.pageSize)
        }
    },
    created() {

    },
    methods: {
        onSizeChange(value) {
            this.$emit('size-change', value)
        },
        onCurrentChange(value) {
            this.$emit('current-change', value)
        }
    },
};
</script>

<style scoped lang="less">
.custom-current-page {
    text-align: center;
}
</style>