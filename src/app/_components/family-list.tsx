// import { DataGrid, type GridColDef } from '@mui/x-data-grid';

interface FamilyMember {
    id: number;
    name: string;
    relationship: string;
    age: number;
}

// const columns: GridColDef<FamilyMember>[] = [
//     { field: 'name', headerName: 'Name', width: 200, sortable: true, filterable: true },
//     { field: 'relationship', headerName: 'Relationship', width: 200, sortable: true },
//     { field: 'age', headerName: 'Age', width: 100, sortable: true, type: 'number' },
// ];

// const rows: FamilyMember[] = [
//     { id: 1, name: 'John Doe', relationship: 'Father', age: 50 },
//     { id: 2, name: 'Jane Doe', relationship: 'Mother', age: 45 },
//     { id: 3, name: 'Alice Doe', relationship: 'Daughter', age: 20 },
//     { id: 4, name: 'Bob Doe', relationship: 'Son', age: 15 },
// ];

function FamilyList() {
    return (
        <div style={{ height: 500, width: '100%' }}>
            {/* <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10, 25, 100]}
                disableRowSelectionOnClick
            /> */}
        </div>
    );
}

export default FamilyList;