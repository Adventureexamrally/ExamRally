import React, { useContext, useEffect, useState } from 'react'
import DashBoard from './DashBoard'
import { UserContext } from '../../context/UserProvider';
import Api from '../../service/Api';
import { 
  CircularProgress, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  Chip, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Error as ErrorIcon, 
  CheckCircle as ResolvedIcon, 
  Pending as PendingIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 24px 0 rgba(0,0,0,0.12)'
  }
}));

const StatusChip = styled(Chip)(({ status, theme }) => ({
  fontWeight: 600,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
    height: '24px'
  },
  ...(status === 'Resolved' && {
    backgroundColor: '#e6f7ee',
    color: '#10b981'
  }),
  ...(status === 'Pending' && {
    backgroundColor: '#fff8e6',
    color: '#f59e0b'
  }),
  ...(!status || status === 'Rejected' && {
    backgroundColor: '#feecec',
    color: '#ef4444'
  })
}));

const ErrorReport = () => {
    const [open, setOpen] = useState(false);
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    
    const handleDrawerToggle = () => {
        setOpen(!open);
    };
    
    const { user } = useContext(UserContext);

    const fetchReports = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await Api.get('reports/get-reports');
            const userReports = response.data.filter(report =>
                report.userName === user?.firstName &&
                report.emailId === user?.email
            );
            setReports(userReports);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setError('Failed to load reports. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [user]);
    
    const getStatusIcon = (status) => {
      switch(status) {
        case 'Resolved':
          return <ResolvedIcon fontSize="small" />;
        case 'Pending':
          return <PendingIcon fontSize="small" />;
        default:
          return <ErrorIcon fontSize="small" />;
      }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <DashBoard 
              handleDrawerToggle={handleDrawerToggle} 
              open={open} 
              setOpen={setOpen} 
              isMobile={isMobile}
            />
            <Box 
              component="main" 
              sx={{ 
                flexGrow: 1, 
                p: isMobile ? 1 : 3,
                marginLeft: open && !isMobile ? '240px' : '0px',
                transition: theme.transitions.create('margin', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
                width: '100%',
                overflowX: 'hidden'
              }}
            >
              <Typography 
                variant={isMobile ? 'h5' : 'h4'} 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  mb: 3,
                  px: isMobile ? 1 : 0
                }}
              >
                Error Reports
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3, mx: isMobile ? 1 : 0 }}>
                  {error}
                </Alert>
              )}
              
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : reports.length === 0 ? (
                <Alert 
                  severity="info" 
                  icon={<InfoIcon />}
                  sx={{ mx: isMobile ? 1 : 0 }}
                >
                  You haven't submitted any error reports yet.
                </Alert>
              ) : (
                <Box sx={{ px: isMobile ? 1 : 0 }}>
                  {reports.map((report, index) => (
                    <StyledCard key={index}>
                      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          mb: 2,
                          flexDirection: isMobile ? 'column' : 'row',
                          gap: isMobile ? 1 : 0,
                          alignItems: isMobile ? 'flex-start' : 'center'
                        }}>
                          <Typography 
                            variant={isMobile ? 'subtitle1' : 'h6'} 
                            component="h2" 
                            sx={{ fontWeight: 600 }}
                          >
                            {report.examName}
                          </Typography>
                          <StatusChip
                            label={report.status || 'Pending'}
                            status={report.status}
                            icon={getStatusIcon(report.status)}
                            size={isMobile ? 'small' : 'medium'}
                          />
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 500, 
                            mb: 1,
                            fontSize: isMobile ? '0.9rem' : '1rem'
                          }}
                        >
                          Reported Issues:
                        </Typography>
                        
                        <List dense sx={{ py: 0 }}>
                          {(Array.isArray(report.reasons)
                              ? report.reasons
                              : report.reasons?.split(',')
                            )?.map((reason, index) => (
                            <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                              <ListItemIcon sx={{ minWidth: '32px' }}>
                                <ErrorIcon 
                                  color="error" 
                                  fontSize={isMobile ? 'small' : 'medium'} 
                                />
                              </ListItemIcon>
                              <ListItemText 
                                primary={reason.trim()} 
                                primaryTypographyProps={{
                                  fontSize: isMobile ? '0.875rem' : '1rem'
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                        
                        {report.comment && (
                          <>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 500, 
                                mt: 2, 
                                mb: 1,
                                fontSize: isMobile ? '0.9rem' : '1rem'
                              }}
                            >
                              Additional Comments:
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ 
                                pl: isMobile ? 2 : 4,
                                fontSize: isMobile ? '0.875rem' : '1rem'
                              }}
                            >
                              {report.comment}
                            </Typography>
                          </>
                        )}
                        
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'flex-end',
                          mt: 2
                        }}>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{
                              fontSize: isMobile ? '0.7rem' : '0.8rem'
                            }}
                          >
                            Reported on: {new Date(report.createdAt || new Date()).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                    </StyledCard>
                  ))}
                </Box>
              )}
            </Box>
        </Box>
    )
}

export default ErrorReport;